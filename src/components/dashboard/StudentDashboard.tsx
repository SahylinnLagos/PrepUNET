import React from 'react';
import { useState, useMemo } from 'react';
import { Student, Tutor } from '../../types';
import { getTutors, getTutorAverageRating } from '../../utils/localStorage';
import { useConnections } from '../../contexts/ConnectionContext';
import { careers, subjects } from '../../data/mockData';
import { BookOpen, Users, Star, DollarSign, Mail, User } from 'lucide-react';
import ConnectionRequestModal from '../modals/ConnectionRequestModal';
import ChatModal from '../modals/ChatModal';
import ReviewModal from '../modals/ReviewModal';
import StarRating from '../common/StarRating';
import FilterBar from '../common/FilterBar';

interface StudentDashboardProps {
  student: Student;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const tutors = getTutors();
  const { userConnections, getConnectionStatus } = useConnections();
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTutorType, setSelectedTutorType] = useState('');

  // Filter tutors based on search criteria
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor => {
      const matchesSearch = !searchTerm || 
        `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !selectedSubject || 
        tutor.subjects.some(subject => 
          subject.name.toLowerCase().includes(selectedSubject.toLowerCase())
        );
      
      const matchesTutorType = !selectedTutorType || tutor.tutorType === selectedTutorType;
      
      return matchesSearch && matchesSubject && matchesTutorType;
    });
  }, [tutors, searchTerm, selectedSubject, selectedTutorType]);

  const relevantTutors = tutors.filter(tutor =>
    tutor.subjects.some(subject =>
      subject.name.toLowerCase().includes(student.subjectOfInterest.toLowerCase())
    )
  );

  const acceptedConnections = userConnections.filter(conn => conn.status === 'accepted');
  const pendingConnections = userConnections.filter(conn => conn.status === 'pending');

  const handleRequestConnection = (tutor: Tutor) => {
    setSelectedTutor(tutor);
    setShowRequestModal(true);
  };

  const handleOpenChat = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setShowChatModal(true);
  };

  const handleOpenReview = (connection: any, tutor: Tutor) => {
    setSelectedConnection({ ...connection, tutorName: `${tutor.firstName} ${tutor.lastName}` });
    setShowReviewModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedTutorType('');
  };

  // Get all unique subjects from tutors for filter
  const allSubjects = useMemo(() => {
    const subjectSet = new Set<string>();
    tutors.forEach(tutor => {
      tutor.subjects.forEach(subject => {
        subjectSet.add(subject.name);
      });
    });
    return Array.from(subjectSet).sort();
  }, [tutors]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {student.firstName}! 👋
        </h1>
        <p className="text-blue-100">
          Encuentra preparadores especializados en {student.subjectOfInterest} para mejorar en tu carrera de {student.career}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{tutors.length}</p>
              <p className="text-gray-600">Preparadores Disponibles</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{relevantTutors.length}</p>
              <p className="text-gray-600">Preparadores Relevantes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{acceptedConnections.length}</p>
              <p className="text-gray-600">Conexiones Activas</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Connections */}
      {acceptedConnections.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Mis Preparadores
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              {acceptedConnections.map((connection) => {
                const tutor = tutors.find(t => t.id === connection.tutorId);
                if (!tutor) return null;
                
                return (
                  <div key={connection.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 rounded-full p-3">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tutor.firstName} {tutor.lastName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Código de reseña: <span className="font-mono font-bold">{connection.reviewCode}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            Conectado desde: {new Date(connection.acceptedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOpenChat(connection.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Chat
                        </button>
                        <button
                          onClick={() => handleOpenReview(connection, tutor)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Reseña
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingConnections.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Solicitudes Pendientes
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              {pendingConnections.map((connection) => {
                const tutor = tutors.find(t => t.id === connection.tutorId);
                if (!tutor) return null;
                
                return (
                  <div key={connection.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-100 rounded-full p-3">
                        <User className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {tutor.firstName} {tutor.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Solicitud enviada el {new Date(connection.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Available Tutors */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Preparadores Disponibles
          </h2>
        </div>
        
        <div className="p-6">
          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedTutorType={selectedTutorType}
            onTutorTypeChange={setSelectedTutorType}
            selectedCareer=""
            onCareerChange={() => {}}
            subjects={allSubjects}
            careers={careers}
            showTutorFilters={true}
            onClearFilters={handleClearFilters}
          />

          {/* Relevant Tutors Section */}
          {/* {relevantTutors.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">
                No encontramos preparadores específicos para "{student.subjectOfInterest}"
              </p>
            </div>
          ) : (
            <div className="mb-8">
              <h3 className="text-lg font-medium text-green-700 mb-4">
                📚 Preparadores relevantes para "{student.subjectOfInterest}"
              </h3>
              <div className="grid gap-6">
                {relevantTutors.filter(tutor => {
                  const matchesSearch = !searchTerm || 
                    `${tutor.firstName} ${tutor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesSubject = !selectedSubject || 
                    tutor.subjects.some(subject => 
                      subject.name.toLowerCase().includes(selectedSubject.toLowerCase())
                    );
                  const matchesTutorType = !selectedTutorType || tutor.tutorType === selectedTutorType;
                  return matchesSearch && matchesSubject && matchesTutorType;
                }).map((tutor) => (
                  <TutorCard 
                    key={tutor.id} 
                    tutor={tutor} 
                    student={student} 
                    onRequestConnection={handleRequestConnection}
                    isRelevant={true}
                  />
                ))}
              </div>
            </div>
          )} */}

          {/* All Tutors Section */}
          <div className={relevantTutors.length > 0 ? "border-t border-gray-200 pt-6" : ""}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Todos los Preparadores
            </h3>
            <div className="grid gap-6">
              {filteredTutors.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No se encontraron preparadores con los filtros seleccionados
                  </p>
                </div>
              ) : (
                filteredTutors.map((tutor) => (
                  <TutorCard 
                    key={tutor.id} 
                    tutor={tutor} 
                    student={student} 
                    onRequestConnection={handleRequestConnection}
                    isRelevant={false}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && selectedTutor && (
        <ConnectionRequestModal
          tutor={selectedTutor}
          student={student}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedTutor(null);
          }}
        />
      )}

      {/* Review Modal */}
      {showChatModal && selectedConnectionId && (
        <ChatModal
          connectionId={selectedConnectionId}
          onClose={() => {
            setShowChatModal(false);
            setSelectedConnectionId(null);
          }}
        />
      )}

      {showReviewModal && selectedConnection && (
        <ReviewModal
          connection={selectedConnection}
          tutorName={selectedConnection.tutorName}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedConnection(null);
          }}
          onReviewSubmitted={() => {}}
        />
      )}
    </div>
  );
};

interface TutorCardProps {
  tutor: Tutor;
  student: Student;
  onRequestConnection: (tutor: Tutor) => void;
  isRelevant: boolean;
}

const TutorCard: React.FC<TutorCardProps> = ({ tutor, student, onRequestConnection, isRelevant }) => {
  const { getConnectionStatus } = useConnections();
  const relevantSubjects = tutor.subjects.filter(subject =>
    subject.name.toLowerCase().includes(student.subjectOfInterest.toLowerCase())
  );

  const connection = getConnectionStatus(student.id, tutor.id);
  const averageRating = getTutorAverageRating(tutor.id);

  return (
    <div className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
      isRelevant ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className={`rounded-full ${
            isRelevant ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <img src={tutor.img} alt="Imagen" width={120} height={120} style={{borderRadius:'50%'}} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {tutor.firstName} {tutor.lastName}
            </h3>
            <p className="text-sm text-gray-900">
              {tutor.genero}
            </p>
            <p className="text-sm text-gray-900">
              {tutor.date}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`px-2 py-1 rounded-full text-xs ${
                tutor.tutorType === 'unet' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {tutor.tutorType === 'unet' ? 'Preparador' : 'Clases Privadas'}
              </span>
              {averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <StarRating rating={averageRating} size="sm" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm text-gray-600">Materias que asesora</p>
          <p className="text-2xl font-bold text-gray-900">{tutor.subjects.length}</p>
        </div>
      </div>

      {/* Relevant Subjects */}
      {isRelevant && relevantSubjects.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-green-700 mb-2">
            📚 Relevante para ti:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {relevantSubjects.map((subject) => (
              <div key={subject.id} className="bg-green-50 border border-green-200 rounded-md p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-900">{subject.name}</span>
                  <span className="text-green-700 font-semibold">
                    {subject.pricePerHour} COP (Pesos Colombianos)/hr
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Subjects */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Todas las materias:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {tutor.subjects.map((subject) => (
            <div key={subject.id} className="bg-gray-50 border border-gray-200 rounded-md p-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{subject.name}</span>
                <span className="text-sm text-gray-600 font-semibold">
                  {subject.pricePerHour} COP (Pesos Colombianos)/hr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      <div className="flex justify-end">
        {!connection ? (
          <button
            onClick={() => onRequestConnection(tutor)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Solicitar Conexión</span>
          </button>
        ) : connection.status === 'pending' ? (
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium">
            Solicitud Pendiente
          </span>
        ) : connection.status === 'accepted' ? (
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-md text-sm font-medium">
            ✓ Conectado
          </span>
        ) : (
          <span className="bg-red-100 text-red-800 px-4 py-2 rounded-md text-sm font-medium">
            Solicitud Rechazada
          </span>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;