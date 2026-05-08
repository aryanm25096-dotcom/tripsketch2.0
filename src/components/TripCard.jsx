import { useState } from 'react';
import { Heart, MapPin, Sparkles, Send } from 'lucide-react';
import { askAboutPlace } from '../lib/askPlace';


const trackRecentlyViewed = (spot) => {
  try {
    const raw = localStorage.getItem('recently_viewed');
    const list = raw ? JSON.parse(raw) : [];
    // Remove if already exists, then add to front
    const updated = [spot, ...list.filter(s => s.id !== spot.id)].slice(0, 5);
    localStorage.setItem('recently_viewed', JSON.stringify(updated));
  } catch (e) {
    console.error('Could not update recently viewed:', e);
  }
};

export default function TripCard({ spot }) {
  const [isSaved, setIsSaved] = useState(() => {
    const saved = localStorage.getItem(`saved_${spot.id}`);
    return saved === 'true';
  });
  const [askMode, setAskMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  
  const [imgSrc, setImgSrc] = useState(spot.image);
  const handleImageError = () => {
    // Beautiful scenic fallback if Wikipedia/LoremFlickr fails
    setImgSrc(`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800`);
  };

  const toggleSave = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    localStorage.setItem(`saved_${spot.id}`, newState.toString());
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAiResponse(''); 
    const response = await askAboutPlace(spot.name, question);
    setAiResponse(response);
    setLoading(false);
    setQuestion('');
  };

  
  const handleAskToggle = () => {
    if (!askMode) trackRecentlyViewed(spot);
    setAskMode(!askMode);
    setAiResponse('');
  };

  
  const tags = Array.isArray(spot.tags) ? spot.tags : [];

  return (
    <div className="trip-card">
      <div className="trip-card-image">
        <img
          src={imgSrc}
          alt={spot.name}
          loading="lazy"
          onError={handleImageError}
        />
        <button className={`save-btn ${isSaved ? 'saved' : ''}`} onClick={toggleSave}>
          <Heart fill={isSaved ? '#ff4757' : 'none'} color={isSaved ? '#ff4757' : '#fff'} />
        </button>
        <div className="vibe-badge">{spot.vibe}</div>
      </div>

      <div className="trip-card-content">
        <div className="card-header">
          <h3>{spot.name}</h3>
          <span className="rating">★ {spot.rating}</span>
        </div>

        <p className="location"><MapPin size={14} /> {spot.location}</p>

        <p className="description">{spot.description}</p>

        
        {tags.length > 0 && (
          <div className="tags">
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <button
            className="ask-btn"
            onClick={handleAskToggle}
            title="Ask AI about this place"
          >
            <Sparkles size={16} /> {askMode ? 'Close' : 'Ask AI'}
          </button>
        </div>

        {/* Ask Gemini Section */}
        {askMode && (
          <div className="ai-chat-section">
           
            {loading && (
              <div className="ai-response loading">
                <Sparkles size={14} className="ai-icon" />
                <p>Thinking...</p>
              </div>
            )}
            {!loading && aiResponse && (
              <div className="ai-response">
                <Sparkles size={14} className="ai-icon" />
                <p>{aiResponse}</p>
              </div>
            )}
            <form onSubmit={handleAsk} className="ask-form">
              <input
                type="text"
                placeholder="Is this good for solo travel in Dec?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading || !question.trim()}>
                {loading ? <div className="mini-spinner" /> : <Send size={14} />}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
