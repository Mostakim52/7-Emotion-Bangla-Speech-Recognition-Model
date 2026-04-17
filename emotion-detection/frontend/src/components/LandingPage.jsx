import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const contributorUsernames = [
    'Mostakim52',
    'Crysis-Pixel',
    'Md-Musfiq-Hossain',
  ];

  const themeClasses = ['theme-cobalt', 'theme-sunset', 'theme-aurora'];

  const [contributors, setContributors] = useState(
    contributorUsernames.map((username) => ({
      username,
      name: username,
      handle: `@${username}`,
      bio: 'Loading GitHub profile...',
      avatarUrl: `https://github.com/${username}.png?size=240`,
      profileUrl: `https://github.com/${username}`,
      followers: 0,
      publicRepos: 0,
      location: '',
      company: '',
      joinedAt: '',
    }))
  );

  const compactNumber = useMemo(
    () =>
      new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    []
  );

  useEffect(() => {
    let isCancelled = false;

    const loadContributorProfiles = async () => {
      const profiles = await Promise.all(
        contributorUsernames.map(async (username) => {
          try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            if (!response.ok) {
              throw new Error(`GitHub returned ${response.status}`);
            }

            const data = await response.json();
            return {
              username,
              name: data.name || data.login || username,
              handle: `@${data.login || username}`,
              bio: data.bio || 'Contributing to this Bangla emotion recognition project.',
              avatarUrl: data.avatar_url || `https://github.com/${username}.png?size=240`,
              profileUrl: data.html_url || `https://github.com/${username}`,
              followers: Number.isFinite(data.followers) ? data.followers : 0,
              publicRepos: Number.isFinite(data.public_repos) ? data.public_repos : 0,
              location: data.location || '',
              company: data.company || '',
              joinedAt: data.created_at || '',
            };
          } catch (error) {
            return {
              username,
              name: username,
              handle: `@${username}`,
              bio: 'Contributing to this Bangla emotion recognition project.',
              avatarUrl: `https://github.com/${username}.png?size=240`,
              profileUrl: `https://github.com/${username}`,
              followers: 0,
              publicRepos: 0,
              location: '',
              company: '',
              joinedAt: '',
            };
          }
        })
      );

      if (!isCancelled) {
        setContributors(profiles);
      }
    };

    void loadContributorProfiles();

    return () => {
      isCancelled = true;
    };
  }, []);

  const formatJoinedDate = (isoDate) => {
    if (!isoDate) {
      return '';
    }
    const date = new Date(isoDate);
    return Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        });
  };

  const options = [
    {
      icon: '🤖',
      title: 'Assistant',
      description: 'Chat with our Bangla voice assistant',
      to: '/assistant',
    },
    {
      icon: '📚',
      title: 'Incremental Learning',
      description: 'Improve model Bangla recognition skills',
      to: '/learning',
    },
    {
      icon: '🎙️',
      title: 'Real-Time Emotion Detection',
      description: 'Detect emotions instantly from your voice',
      to: '/realtime-emotion',
    },
  ];

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>বাংলা মুড অ্যাসিস্ট্যান্ট</h1>
        <div className="options-container">
          {options.map((option) => (
            <Link key={option.to} to={option.to} className="option-card">
              <div className="option-icon">{option.icon}</div>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
            </Link>
          ))}
        </div>

        <section className="contributors-section" aria-labelledby="contributors-title">
          <h2 id="contributors-title">Built By</h2>
          <div className="contributors-grid">
            {contributors.map((person, index) => (
              <a
                key={person.username}
                className={`contributor-card ${themeClasses[index % themeClasses.length]}`}
                href={person.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${person.name} GitHub profile`}
              >
                <div className="contributor-hero">
                  <span className="contributor-pulse">Contributor</span>
                  <div className="contributor-avatar-frame">
                    <img
                      className="contributor-avatar"
                      src={person.avatarUrl}
                      alt={`${person.name} profile`}
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="contributor-stats" aria-hidden="true">
                  <div>
                    <strong>{compactNumber.format(person.followers)}</strong>
                    <span>Followers</span>
                  </div>
                  <div>
                    <strong>{compactNumber.format(person.publicRepos)}</strong>
                    <span>Public Repos</span>
                  </div>
                </div>

                <div className="contributor-body">
                  <h3>{person.name}</h3>
                  <p className="contributor-handle">{person.handle}</p>
                  <p className="contributor-role">Equal Contributor</p>
                  <p className="contributor-summary">{person.bio}</p>

                  {formatJoinedDate(person.joinedAt) && (
                    <p className="contributor-joined">GitHub since {formatJoinedDate(person.joinedAt)}</p>
                  )}

                  <span className="contributor-link">Visit GitHub Profile ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;