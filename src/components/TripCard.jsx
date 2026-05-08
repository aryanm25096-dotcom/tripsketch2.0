import { useState } from 'react';
import { Heart, MapPin, Sparkles, Send } from 'lucide-react';
import { askAboutPlace } from '../lib/askPlace';

// ✅ Fix 4: Track recently viewed in localStorage
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

  // ✅ Fix 1: Fallback image if Unsplash fails
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
    setAiResponse(''); // ✅ Fix 3: Clear old response before new one loads
    const response = await askAboutPlace(spot.name, question);
    setAiResponse(response);
    setLoading(false);
    setQuestion('');
  };

  // ✅ Fix 4: Track when user opens the card details
  const handleAskToggle = () => {
    if (!askMode) trackRecentlyViewed(spot);
    setAskMode(!askMode);
    setAiResponse('');
  };

  // ✅ Fix 2: Safe tags — fallback to empty array if undefined
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

        {/* ✅ Fix 2: Safe .map() with fallback */}
        {tags.length > 0 && (
          <div className="tags">
            {tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        )}

        <div className="card-footer">
          <div className="price">
            <span className="amount">₹{spot.budget}</span> / day
          </div>
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
            {/* ✅ Fix 3: Show loading state clearly, clears old response */}
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
