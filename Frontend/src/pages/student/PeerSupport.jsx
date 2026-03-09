import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wind,
  Leaf,
  Zap,
  Moon,
  Heart,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Users,
  Send,
  Plus,
  Star,
  ArrowLeft
} from 'lucide-react';
import styles from './PeerSupport.module.scss';

const CHANNELS = [
  {
    id: 'anxiety',
    name: 'Anxiety Support',
    description: 'Dealing with anxiety and panic',
    icon: Wind,
    members: 23
  },
  {
    id: 'depression',
    name: 'Depression Support',
    description: 'Support for depression & low moods',
    icon: Leaf,
    members: 31
  },
  {
    id: 'stress',
    name: 'Stress & Overwhelm',
    description: 'Managing stress and pressure',
    icon: Zap,
    members: 18
  },
  {
    id: 'sleep',
    name: 'Sleep Issues',
    description: 'Insomnia and sleep problems',
    icon: Moon,
    members: 15
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Family, friends, dating support',
    icon: Heart,
    members: 27
  },
  {
    id: 'selfcare',
    name: 'Self-Care',
    description: 'Building healthy habits',
    icon: Sparkles,
    members: 34
  },
  {
    id: 'general',
    name: 'General Support',
    description: 'Open discussions & check-ins',
    icon: MessageCircle,
    members: 42
  }
];

const INITIAL_MESSAGES = {
  anxiety: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '2 hours ago',
      text: 'Had my first panic attack in months today. The breathing techniques we talked about here really helped me get through it. Thank you all for the support!',
      reactions: [{ type: 'heart', count: 5, reacted: false }, { type: 'support', count: 3, reacted: false }]
    },
    {
      id: 2,
      username: 'Anonymous',
      timestamp: '1 hour ago',
      text: 'That\'s amazing! I\'m so proud of you for using those techniques. It shows how much you\'ve grown.',
      reactions: [{ type: 'clap', count: 2, reacted: false }]
    },
  ],
  depression: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '3 hours ago',
      text: 'Having one of those days where getting out of bed feels impossible. But I\'m here, I\'m trying, and that\'s something.',
      reactions: [{ type: 'strength', count: 8, reacted: false }, { type: 'star', count: 4, reacted: false }]
    },
  ],
  general: [
    {
      id: 1,
      username: 'Anonymous',
      timestamp: '30 min ago',
      text: 'Just wanted to say thank you to this community. Having a safe space to share without judgment means everything. You all are amazing!',
      reactions: [{ type: 'heart', count: 15, reacted: false }, { type: 'hug', count: 8, reacted: false }]
    },
  ]
};

const COMMON_REACTIONS = [
  { id: 'heart', icon: Heart, color: '#ff4d4f' },
  { id: 'support', icon: Users, color: '#52c41a' },
  { id: 'strength', icon: Zap, color: '#faad14' },
  { id: 'star', icon: Star, color: '#fadb14' },
  { id: 'hug', icon: Heart, color: '#eb2f96' }, // Fallback icon as Lucide doesn't have hug
  { id: 'clap', icon: Sparkles, color: '#1890ff' }
];

export function PeerSupport() {
  const navigate = useNavigate();
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChannel]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      username: 'Anonymous',
      timestamp: 'just now',
      text: newMessage,
      reactions: []
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), userMessage]
    }));

    setNewMessage('');
  };

  const handleReaction = (messageId, type) => {
    setMessages(prev => ({
      ...prev,
      [activeChannel]: prev[activeChannel].map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find(r => r.type === type);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.type === type
                  ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...msg,
              reactions: [...msg.reactions, { type, count: 1, reacted: true }]
            };
          }
        }
        return msg;
      })
    }));
    setShowReactionPicker(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeChannelData = CHANNELS.find(c => c.id === activeChannel);
  const currentMessages = messages[activeChannel] || [];

  const getReactionIcon = (type) => {
    const reaction = COMMON_REACTIONS.find(r => r.id === type);
    if (!reaction) return Heart; // Default icon if not found
    return reaction.icon;
  };

  return (
    <div className={styles.peerSupport}>
      <div className={styles.header} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '50%',
            backgroundColor: 'var(--panel-2, #ffffff)', border: '1px solid var(--border)',
            cursor: 'pointer', color: 'var(--text-dark)', marginTop: '4px', flexShrink: 0
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div style={{ flexGrow: 1, textAlign: 'center', paddingRight: '40px' }}>
          <h1 style={{ marginTop: 0 }}>Peer Support Channels</h1>
          <p>Connect anonymously with others who understand your journey</p>
          <div className={styles.anonymousIndicator} style={{ justifyContent: 'center' }}>
            <ShieldCheck size={16} />
            <span>Your identity is protected - All conversations are anonymous</span>
          </div>
        </div>
      </div>

      <div className={styles.channelsContainer}>
        <div className={styles.channelsList}>
          <h3><MessageCircle size={18} /> Support Channels</h3>
          {CHANNELS.map(channel => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.id}
                className={`${styles.channelItem} ${activeChannel === channel.id ? styles.active : ''} `}
                onClick={() => setActiveChannel(channel.id)}
              >
                <div className={styles.channelIcon}><Icon size={20} /></div>
                <div className={styles.channelInfo}>
                  <div className={styles.channelName}>{channel.name}</div>
                  <div className={styles.channelDesc}>{channel.description}</div>
                  <div className={styles.memberCount}>{channel.members} members online</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.chatContainer}>
          <div className={styles.chatHeader}>
            <h3>
              {activeChannelData && <activeChannelData.icon size={20} style={{ marginRight: 8 }} />}
              {activeChannelData?.name}
            </h3>
            <div className={styles.onlineStatus}>{activeChannelData?.members} members online</div>
          </div>

          <div className={styles.messagesContainer}>
            {currentMessages.map(message => (
              <div key={message.id} className={styles.messageGroup}>
                <div className={styles.messageHeader}>
                  <div className={styles.avatar}><Users size={14} /></div>
                  <span className={styles.username}>Anonymous</span>
                  <span className={styles.timestamp}>{message.timestamp}</span>
                </div>
                <div className={styles.messageContent}>
                  <div className={styles.messageText}>{message.text}</div>
                  <div className={styles.messageReactions}>
                    {message.reactions.map(reaction => {
                      const Icon = getReactionIcon(reaction.type);
                      return (
                        <button
                          key={reaction.type}
                          className={`${styles.reaction} ${reaction.reacted ? styles.reacted : ''} `}
                          onClick={() => handleReaction(message.id, reaction.type)}
                        >
                          <Icon size={12} className={styles.icon} />
                          <span className={styles.count}>{reaction.count}</span>
                        </button>
                      )
                    })}
                    <button
                      className={styles.addReaction}
                      onClick={() => setShowReactionPicker(showReactionPicker === message.id ? null : message.id)}
                    ><Plus size={14} /></button>
                    {showReactionPicker === message.id && (
                      <div className={styles.reactionPicker}>
                        {COMMON_REACTIONS.map(reaction => {
                          const Icon = reaction.icon;
                          return (
                            <button
                              key={reaction.id}
                              onClick={() => handleReaction(message.id, reaction.id)}
                              title={reaction.id}
                            >
                              <Icon size={16} />
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.messageInput}>
            <div className={styles.inputContainer}>
              <textarea
                className={styles.textInput}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Share your thoughts in #${activeChannelData?.name}...`}
                rows={1}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}