import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Student, Tutor, Subject } from '../types';
import { updateUser, getTutorAverageRating, getReviewsByTutor } from '../utils/localStorage';
import { careers, subjects } from '../data/mockData';
import { User, Edit3, Save, X, Plus, Trash2, Star } from 'lucide-react';
import StarRating from '../components/common/StarRating';
import ImageUpload from '../components/common/ImageUpload';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    idCard: user?.idCard || '',
    // Student specific
    career: (user as Student)?.career || '',
    subjectOfInterest: (user as Student)?.subjectOfInterest || '',
    // Tutor specific
    tutorType: (user as Tutor)?.tutorType || 'unet',
  });
  const [tutorSubjects, setTutorSubjects] = useState<Subject[]>(
    user?.role === 'tutor' ? (user as Tutor).subjects : []
  );
  const [profileImage, setProfileImage] = useState<string | null>(user?.img || null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const tutorReviews = user.role === 'tutor' ? getReviewsByTutor(user.id) : [];
  const averageRating = user.role === 'tutor' ? getTutorAverageRating(user.id) : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: '',
      pricePerHour: 0,
    };
    setTutorSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number) => {
    setTutorSubjects(prev => prev.map(subject => 
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const removeSubject = (id: string) => {
    setTutorSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  const handleSave = () => {
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.idCard) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (user.role === 'student' && (!formData.career || !formData.subjectOfInterest)) {
      setError('Por favor completa todos los campos del estudiante');
      return;
    }

    if (user.role === 'tutor' && tutorSubjects.length === 0) {
      setError('Por favor agrega al menos una materia');
      return;
    }

    if (user.role === 'tutor') {
      for (const subject of tutorSubjects) {
        if (!subject.name || subject.pricePerHour <= 0) {
          setError('Por favor completa todos los campos de las materias');
          return;
        }
      }
    }

    // Update user
    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      idCard: formData.idCard,
      img: profileImage || undefined,
      ...(user.role === 'student' && {
        career: formData.career,
        subjectOfInterest: formData.subjectOfInterest,
      }),
      ...(user.role === 'tutor' && {
        tutorType: formData.tutorType as 'unet' | 'private',
        subjects: tutorSubjects,
      }),
    };

    
    updateUser(updatedUser);
    setIsEditing(false);
    setSuccess('Perfil actualizado exitosamente');
    
    // Update auth context would require a refresh or context update
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      idCard: user.idCard,
      career: (user as Student)?.career || '',
      subjectOfInterest: (user as Student)?.subjectOfInterest || '',
      tutorType: (user as Tutor)?.tutorType || 'unet',
    });
    setTutorSubjects(user.role === 'tutor' ? (user as Tutor).subjects : []);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 rounded-full p-3">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Mi Perfil
                  </h1>
                  <p className="text-gray-600 capitalize">
                    {user.role === 'student' ? 'Estudiante' : 'Preparador'}
                  </p>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editar Perfil</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Guardar</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancelar</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mx-6 mt-4 bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Profile Content */}
          <div className="p-6">
            {/* Profile Image Section */}
            {isEditing && (
              <div className="mb-8 pb-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Imagen de Perfil
                </h3>
                <ImageUpload
                  currentImage={profileImage || undefined}
                  onImageChange={setProfileImage}
                />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Información Personal
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cédula de Identidad
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="idCard"
                        value={formData.idCard}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.idCard}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Role-specific Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {user.role === 'student' ? 'Información Académica' : 'Información Profesional'}
                </h3>

                {user.role === 'student' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Carrera
                      </label>
                      {isEditing ? (
                        <select
                          name="career"
                          value={formData.career}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecciona tu carrera</option>
                          {careers.map(career => (
                            <option key={career} value={career}>{career}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900">{(user as Student).career}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Materia de Interés
                      </label>
                      {isEditing ? (
                        <select
                          name="subjectOfInterest"
                          value={formData.subjectOfInterest}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecciona una materia</option>
                          {subjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-gray-900">{(user as Student).subjectOfInterest}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Preparador
                      </label>
                      {isEditing ? (
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="tutorType"
                              value="unet"
                              checked={formData.tutorType === 'unet'}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <span>Preparador</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="tutorType"
                              value="private"
                              checked={formData.tutorType === 'private'}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            <span>Clases Privadas</span>
                          </label>
                        </div>
                      ) : (
                        <p className="text-gray-900">
                          {(user as Tutor).tutorType === 'unet' ? 'Preparador' : 'Clases Privadas'}
                        </p>
                      )}
                    </div>

                    {/* Rating Display */}
                    {!isEditing && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Calificación Promedio
                        </label>
                        <div className="flex items-center space-x-2">
                          <StarRating rating={averageRating} />
                          <span className="text-sm text-gray-600">
                            ({tutorReviews.length} reseña{tutorReviews.length !== 1 ? 's' : ''})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tutor Subjects */}
            {user.role === 'tutor' && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Materias que Enseñas
                  </h3>
                  {isEditing && (
                    <button
                      onClick={addSubject}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Agregar Materia</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    {tutorSubjects.map((subject) => (
                      <div key={subject.id} className="flex space-x-3 items-end">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Nombre de la materia"
                            value={subject.name}
                            onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="w-24">
                          <input
                            type="number"
                            placeholder="Precio"
                            value={subject.pricePerHour || ''}
                            onChange={(e) => updateSubject(subject.id, 'pricePerHour', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            min="0"
                          />
                        </div>
                        <div className="text-sm text-gray-600 px-1">COP (Pesos Colombianos)/hr</div>
                        <button
                          onClick={() => removeSubject(subject.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(user as Tutor).subjects.map((subject) => (
                      <div key={subject.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{subject.name}</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green-600">${subject.pricePerHour}</span>
                          <span className="text-sm text-gray-600">por hora</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Section for Tutors */}
            {user.role === 'tutor' && tutorReviews.length > 0 && !isEditing && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Reseñas de Estudiantes
                </h3>
                <div className="space-y-4">
                  {tutorReviews.map((review) => (
                    <div key={review.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <StarRating rating={review.rating} />
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">"{review.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;