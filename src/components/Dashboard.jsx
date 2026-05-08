import { useEffect, useMemo, useState } from 'react';
import TripCard from './TripCard';
import { 
  Heart, Menu, Sun, Moon, MapPin, 
  Sparkles, Search, Grid, Map, 
  CloudSun
} from 'lucide-react';
import { getWeatherAndInfo } from '../lib/weather';
import { generateSpots } from '../lib/spots';

export default function Dashboard() {
  const [theme, setTheme] = useState('light');
  const [spots, setSpots] = useState([]);
  const [destination, setDestination] = useState('');
  const [vibe, setVibe] = useState('All');
  const [crowd, setCrowd] = useState('Any');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [recentlyViewed] = useState(() => {
    try {
      const raw = localStorage.getItem('recently_viewed');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const vibes = ['All', 'Nature', 'Culture', 'Food', 'Adventure'];
  const crowds = ['Any', 'Quiet', 'Moderate', 'Lively'];

  const filteredSpots = useMemo(() => {
    let result = [...spots];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          String(s.name || '').toLowerCase().includes(q) ||
          String(s.location || '').toLowerCase().includes(q) ||
          String(s.description || '').toLowerCase().includes(q)
      );
    }

    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.budget - b.budget);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.budget - a.budget);
    } else if (sortOrder === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [spots, searchQuery, sortOrder]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const fetchSpots = async (dest, v, c) => {
    setIsSearching(true);
    setWeatherInfo(null);

    const newSpots = await generateSpots(dest, v, c);
    setSpots(newSpots);

    try {
      const weather = await getWeatherAndInfo(dest);
      if (weather) setWeatherInfo(weather);
    } catch (e) {
      console.error(e);
    }

    setIsSearching(false);
  };

  const handleExplore = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    await fetchSpots(destination, vibe, crowd);
  };

  
  const handleSurpriseMe = async () => {
    const surprises = [
      'Gokarna, Karnataka',
      'Spiti Valley',
      'Zanskar, Ladakh',
      'Varkala, Kerala',
      'Cherrapunji, Meghalaya',
    ];
    const randomDest = surprises[Math.floor(Math.random() * surprises.length)];
    setDestination(randomDest);
    setVibe('All');
    setCrowd('Any');
    await fetchSpots(randomDest, 'All', 'Any'); // auto-triggers, no manual click needed
  };

  return (
    <div className={`dashboard ${theme}`}>
      {/* Top Navigation */}
      <nav className="dash-nav">
        <div className="dash-logo">TripSketch</div>
        <div className="dash-icons">
          <button className="icon-btn"><Heart size={20} /></button>
          <button className="icon-btn"><Menu size={20} /></button>
          <button className="icon-btn theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="dash-hero">
        <h1>Where to <span>next?</span></h1>
        <p>Tell us your vibe. We'll find the hidden gems.</p>
      </div>

      {/* Search Card */}
      <div className="search-card">
        <form onSubmit={handleExplore}>
          <div className="input-group">
            <label>Destination</label>
            <div className="location-input">
              <MapPin size={20} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Vibe</label>
              <div className="pills-container">
                {vibes.map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`pill ${vibe === v ? 'active' : ''}`}
                    onClick={() => setVibe(v)}
                  >
                    {v === 'All' ? '🌍' : v === 'Nature' ? '🌿' : v === 'Culture' ? '🏛️' : v === 'Food' ? '🍜' : '⛺'} {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>Crowd Tolerance</label>
              <div className="pills-container">
                {crowds.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`pill ${crowd === c ? 'active' : ''}`}
                    onClick={() => setCrowd(c)}
                  >
                    {c === 'Quiet' ? '🧘' : c === 'Moderate' ? '👫' : c === 'Lively' ? '🎉' : ''} {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="btn-surprise" onClick={handleSurpriseMe} disabled={isSearching}>
              <Sparkles size={18} /> Surprise Me
            </button>
            <button type="submit" className="btn-explore" disabled={isSearching}>
              <Search size={18} /> {isSearching ? 'Exploring...' : 'Explore'}
            </button>
          </div>
        </form>
      </div>

      {/* Weather Card */}
      {weatherInfo && (
        <div className="weather-card-container">
          <div className="weather-card-image">
            <img src={weatherInfo.image} alt={destination} />
            <div className="weather-overlay">
              <div className="weather-badge">
                <CloudSun size={24} color="#f1c40f" />
                <span>{weatherInfo.temp}</span>
              </div>
            </div>
          </div>
          <div className="weather-info">
            <h4>{destination}</h4>
            <div className="weather-condition">{weatherInfo.condition}</div>
            <div className="weather-desc">{weatherInfo.description}</div>
          </div>
        </div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && spots.length === 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 3rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>Recently Viewed</h3>
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {recentlyViewed.map(spot => (
              <div key={spot.id} style={{ minWidth: '300px', flex: '0 0 auto' }}>
                <TripCard spot={spot} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed Header */}
      <div className="feed-header">
        <div className="feed-title">
          <h2>Places in <span>{destination || 'Explore'}</span></h2>
          <p>{filteredSpots.length} spots found</p>
        </div>
        <div className="feed-controls">

          <div className="mini-search">
            <Search size={16} color="var(--color-text-muted)" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>


          <select
            className="sort-dropdown"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>

          <div className="view-toggles">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
              <Grid size={18} />
            </button>
            <button className={viewMode === 'map' ? 'active' : ''} onClick={() => setViewMode('map')}>
              <Map size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Fix 5: Map view now actually renders differently */}
      {spots.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="sketchbook-grid">
            {filteredSpots.map(spot => (
              <TripCard key={spot.id} spot={spot} />
            ))}
          </div>
        ) : (
          <div className="map-placeholder" style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--color-surface)',
            borderRadius: '1rem',
            margin: '1rem 0',
            color: 'var(--color-text-muted)'
          }}>
            <Map size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>Map view coming soon — integrate Leaflet.js here</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {filteredSpots.length} spots ready to be pinned
            </p>
          </div>
        )
      ) : (
        <div className="empty-state">
          <Sparkles size={48} color="var(--color-accent)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h3>No hidden gems found here yet.</h3>
          <p>Try searching for a destination like Gokarna, Spiti, or Meghalaya!</p>
          <button className="btn-surprise" onClick={handleSurpriseMe} style={{ marginTop: '1.5rem', margin: '1.5rem auto 0' }}>
            Try Surprise Me!
          </button>
        </div>
      )}
    </div>
  );
}