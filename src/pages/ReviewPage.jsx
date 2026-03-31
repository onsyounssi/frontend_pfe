import React, { useState } from 'react';
import Header from '../components/common/Header';
import NannyInfo from '../components/reviews/NannyInfo';
import RatingStars from '../components/reviews/RatingStars';
import PositiveTags from '../components/reviews/PositiveTags';
import PageContainer from '../components/layout/PageContainer';
import CommentBox from '../components/reviews/CommentBox';
import Button from '../components/common/Button';


const ReviewPage = () => {
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');

  const positiveTags = [
    'Ponctuelle',
    'Professionnelle',
    'Attentionnée',
    'Rassurante',
    'Flexible'
  ];

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePublish = () => {
    const review = {
      rating,
      tags: selectedTags,
      comment,
      date: new Date().toISOString(),
      nannyName: 'Inès R.',
      bookingDate: '12 février 2024'
    };
    console.log('Avis publié :', review);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Laisser un avis" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">

          <NannyInfo
            name="Inès R."
            date="12 février 2024"
            imageUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
          />

          <RatingStars
            rating={rating}
            onRatingChange={setRating}
          />

          <PositiveTags
            tags={positiveTags}
            selectedTags={selectedTags}
            onTagClick={handleTagClick}
          />

          <CommentBox
            value={comment}
            onChange={setComment}
            placeholder="Partagez votre expérience..."
          />

          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => console.log('Avis ignoré')}
            >
              Passer
            </Button>
            <Button
              variant="primary"
              onClick={handlePublish}
              disabled={rating === 0}
            >
              Publier l'avis
            </Button>
          </div>

          {rating === 0 && (
            <p className="text-xs text-center text-gray-500 mt-4">
              * Veuillez attribuer une note avant de publier
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;