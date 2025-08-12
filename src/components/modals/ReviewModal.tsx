import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Connection, Review } from '../../types';
import { saveReview, getReviewByConnection } from '../../utils/localStorage';
import { X, Star, CheckCircle } from 'lucide-react';
import StarRating from '../common/StarRating';

interface ReviewModalProps {
  connection: Connection;
  tutorName: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  connection,
  tutorName,
  onClose,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewCode, setReviewCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const existingReview = getReviewByConnection(connection.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!user) {
      setError('Usuario no encontrado');
      setIsLoading(false);
      return;
    }

    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      setIsLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError('Por favor escribe un comentario');
      setIsLoading(false);
      return;
    }

    if (reviewCode.toUpperCase() !== connection.reviewCode) {
      setError('Código de reseña incorrecto');
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReview: Review = {
      id: Date.now().toString(),
      studentId: user.id,
      tutorId: connection.tutorId,
      connectionId: connection.id,
      rating,
      comment: comment.trim(),
      reviewCode: reviewCode.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    saveReview(newReview);
    setIsSuccess(true);
    
    setTimeout(() => {
      onReviewSubmitted();
      onClose();
    }, 2000);

    setIsLoading(false);
  };

  if (existingReview) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tu Reseña
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="text-center py-4">
            <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Reseña Enviada
            </h3>
            <p className="text-gray-600 mb-4">
              Ya has enviado una reseña para {tutorName}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <div className="flex items-center justify-center mb-2">
                <StarRating rating={existingReview.rating} />
              </div>
              <p className="text-gray-700 text-sm">"{existingReview.comment}"</p>
              <p className="text-xs text-gray-500 mt-2">
                Enviada el {new Date(existingReview.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Calificar Preparador
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Reseña Enviada!
            </h3>
            <p className="text-gray-600">
              Tu reseña para {tutorName} ha sido guardada exitosamente.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">
                {tutorName}
              </h3>
              <p className="text-sm text-gray-600">
                Código de reseña requerido: <span className="font-mono font-bold">{connection.reviewCode}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calificación *
              </label>
              <div className="flex justify-center">
                <StarRating
                  rating={rating}
                  interactive={true}
                  onRatingChange={setRating}
                  size="lg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comentario *
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Comparte tu experiencia con este preparador..."
                required
              />
            </div>

            <div>
              <label htmlFor="reviewCode" className="block text-sm font-medium text-gray-700 mb-1">
                Código de Reseña *
              </label>
              <input
                id="reviewCode"
                type="text"
                value={reviewCode}
                onChange={(e) => setReviewCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Ingresa el código de 6 caracteres"
                maxLength={6}
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Star className="h-4 w-4" />
                    <span>Enviar Reseña</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;