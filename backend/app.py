from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer

nltk.download('vader_lexicon')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

# Initialize models
vader_analyzer = SentimentIntensityAnalyzer()
tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment")
labels = ['negative', 'neutral', 'positive']

def get_roberta_sentiment(text):
    inputs = tokenizer(text, return_tensors="pt")
    outputs = model(**inputs)
    scores = torch.nn.functional.softmax(outputs.logits, dim=1).detach().numpy()[0]
    sentiment_data = dict(zip(labels, scores * 100))
    label = labels[scores.argmax()]
    return {
        "label": label,
        "score": float(scores.max()),
        "positive": float(sentiment_data["positive"]),
        "neutral": float(sentiment_data["neutral"]),
        "negative": float(sentiment_data["negative"])
    }

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        text = data.get('text', '')
        model_choice = data.get('model', 'roberta')
        preprocess = data.get('preprocess', False)

        if not text:
            return jsonify({'error': 'Text is required'}), 400

        if preprocess:
            stopwords = set(nltk.corpus.stopwords.words('english'))
            text = ' '.join([word for word in text.split() if word.lower() not in stopwords])

        if model_choice == 'vader':
            sentiment = vader_analyzer.polarity_scores(text)
            if sentiment['compound'] >= 0.05:
                label = 'positive'
            elif sentiment['compound'] <= -0.05:
                label = 'negative'
            else:
                label = 'neutral'
            return jsonify([{
                'label': label,
                'score': abs(sentiment['compound']),
                'positive': sentiment['pos'] * 100,
                'neutral': sentiment['neu'] * 100,
                'negative': sentiment['neg'] * 100
            }])

        # New RoBERTa model sentiment
        sentiment = get_roberta_sentiment(text)
        return jsonify([sentiment])

    except Exception as e:
        return jsonify({'error': f'Error processing request: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
