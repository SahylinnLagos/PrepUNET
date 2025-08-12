import React from 'react';
import { useState, useMemo } from 'react';
import { Tutor, Student } from '../../types';
import { getStudents, getTutorAverageRating, getReviewsByTutor } from '../../utils/localStorage';
import { useConnections } from '../../contexts/ConnectionContext';
import { careers, subjects } from '../../data/mockData';
import { BookOpen, Users, DollarSign, User, GraduationCap, Mail, Star } from 'lucide-react';
import ChatModal from '../modals/ChatModal';
import StarRating from '../common/StarRating';
import FilterBar from '../common/FilterBar';

interface TutorDashboardProps {
  tutor: Tutor;
}

const TutorDashboard: React.FC<TutorDashboardProps> = ({ tutor }) => {
  const students = getStudents();
  const { userConnections, acceptConnection, rejectConnection } = useConnections();
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  
  const tutorReviews = getReviewsByTutor(tutor.id);
  
  const averagePrice = tutor.subjects.length > 0 
    ? Math.round(tutor.subjects.reduce((sum, subject) => sum + subject.pricePerHour, 0) / tutor.subjects.length)
    : 0;

  const potentialStudents = students.filter(student =>
    tutor.subjects.some(subject =>
      subject.name.toLowerCase().includes(student.subjectOfInterest.toLowerCase()) ||
      student.subjectOfInterest.toLowerCase().includes(subject.name.toLowerCase())
    )
  );

  // Filter students based on search criteria
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !searchTerm || 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = !selectedSubject || 
        student.subjectOfInterest.toLowerCase().includes(selectedSubject.toLowerCase());
      
      const matchesCareer = !selectedCareer || student.career === selectedCareer;
      
      return matchesSearch && matchesSubject && matchesCareer;
    });
  }, [students, searchTerm, selectedSubject, selectedCareer]);

  const pendingRequests = userConnections.filter(conn => conn.status === 'pending');
  const acceptedConnections = userConnections.filter(conn => conn.status === 'accepted');

  const handleAcceptConnection = (connectionId: string) => {
    acceptConnection(connectionId);
  };

  const handleRejectConnection = (connectionId: string) => {
    rejectConnection(connectionId);
  };

  const handleOpenChat = (connectionId: string) => {
    setSelectedConnectionId(connectionId);
    setShowChatModal(true);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('');
    setSelectedCareer('');
  };

  // Get all unique subjects from students for filter
  const allSubjects = useMemo(() => {
    const subjectSet = new Set<string>();
    students.forEach(student => {
      subjectSet.add(student.subjectOfInterest);
    });
    return Array.from(subjectSet).sort();
  }, [students]);

  const averageRating = getTutorAverageRating(tutor.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">
          ¡Bienvenido, {tutor.firstName}! 🎓
        </h1>
        <p className="text-green-100">
          {tutor.tutorType === 'unet' ? 'Preparador' : 'Clases Privadas'} • {tutor.subjects.length} materias disponibles
          {averageRating > 0 && (
            <span className="ml-4 flex items-center space-x-2">
              <StarRating rating={averageRating} size="sm" />
            </span>
          )}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{tutor.subjects.length}</p>
              <p className="text-gray-600">Materias que Enseñas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">${averagePrice}</p>
              <p className="text-gray-600">Precio Promedio/hr</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{acceptedConnections.length}</p>
              <p className="text-gray-600">Estudiantes Conectados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
              <p className="text-gray-600">Solicitudes Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{tutorReviews.length}</p>
              <p className="text-gray-600">Reseñas Recibidas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Solicitudes de Conexión
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              {pendingRequests.map((connection) => {
                const student = students.find(s => s.id === connection.studentId);
                if (!student) return null;
                
                return (
                  <div key={connection.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="bg-yellow-100 rounded-full p-3">
                          <img src={tutor.img} alt="Imagen" width={120} height={120} style={{borderRadius:'50%'}} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-gray-900">
                            {student.genero}
                          </p>
                          <p className="text-sm text-gray-900">
                            {tutor.date}
                          </p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Carrera:</strong> {student.career}</p>
                            <p><strong>Interés:</strong> {student.subjectOfInterest}</p>
                            <p><strong>Email:</strong> {student.email}</p>
                            <p className="text-xs text-gray-500">
                              Solicitud enviada: {new Date(connection.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptConnection(connection.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRejectConnection(connection.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                          Rechazar
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

      {/* My Students */}
      {acceptedConnections.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Mis Estudiantes
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid gap-4">
              {acceptedConnections.map((connection) => {
                const student = students.find(s => s.id === connection.studentId);
                if (!student) return null;
                
                return (
                  <div key={connection.id} className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4">
                        <div className="bg-green-100 rounded-full p-3">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {student.firstName} {student.lastName}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p><strong>Carrera:</strong> {student.career}</p>
                            <p><strong>Interés:</strong> {student.subjectOfInterest}</p>
                            <p>
                              <strong>Código de reseña:</strong> 
                              <span className="font-mono font-bold ml-1">{connection.reviewCode}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Conectado desde: {new Date(connection.acceptedAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleOpenChat(connection.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Chat
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* My Subjects */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Mis Materias
          </h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tutor.subjects.map((subject) => (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 mb-2">{subject.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{subject.pricePerHour} COP (Pesos Colombianos)</span>
                  <span className="text-sm text-gray-600">por hora</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {tutorReviews.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Reseñas de Estudiantes
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            {tutorReviews.slice(0, 5).map((review) => (
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

      {/* Potential Students */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Estudiantes Disponibles
          </h2>
        </div>
        
        <div className="p-6">
          {/* Filter Bar */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedTutorType=""
            onTutorTypeChange={() => {}}
            selectedCareer={selectedCareer}
            onCareerChange={setSelectedCareer}
            subjects={allSubjects}
            careers={careers}
            showStudentFilters={true}
            onClearFilters={handleClearFilters}
          />

          {potentialStudents.length > 0 && (
            <>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                📚 Estudiantes Interesados en tus Materias
              </h3>
              <div className="grid gap-4 mb-8">
                {potentialStudents.filter(student => {
                  const matchesSearch = !searchTerm || 
                    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesSubject = !selectedSubject || 
                    student.subjectOfInterest.toLowerCase().includes(selectedSubject.toLowerCase());
                  const matchesCareer = !selectedCareer || student.career === selectedCareer;
                  return matchesSearch && matchesSubject && matchesCareer;
                }).map((student) => (
                  <StudentCard key={student.id} student={student} tutor={tutor} isPotential={true} />
                ))}
              </div>
            </>
          )}
          
          <div className={potentialStudents.length > 0 ? "border-t border-gray-200 pt-6" : ""}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Todos los Estudiantes
            </h3>
            <div className="grid gap-4">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No se encontraron estudiantes con los filtros seleccionados
                  </p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <StudentCard key={student.id} student={student} tutor={tutor} isPotential={false} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChatModal && selectedConnectionId && (
        <ChatModal
          connectionId={selectedConnectionId}
          onClose={() => {
            setShowChatModal(false);
            setSelectedConnectionId(null);
          }}
        />
      )}
    </div>
  );
};

interface StudentCardProps {
  student: Student;
  tutor: Tutor;
  isPotential: boolean;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, tutor, isPotential }) => {
  const relevantSubjects = tutor.subjects.filter(subject =>
    subject.name.toLowerCase().includes(student.subjectOfInterest.toLowerCase()) ||
    student.subjectOfInterest.toLowerCase().includes(subject.name.toLowerCase())
  );

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
      isPotential ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          <div className={`rounded-full ${
            isPotential ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <img src={student.img} alt="Imagen" width={120} height={120} style={{borderRadius:'50%'}} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-900">
              {student.genero}
            </p>
            
            <p className="text-sm text-gray-900">
              {tutor.date}
            </p>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Carrera:</strong> {student.career}</p>
              <p><strong>Interés:</strong> {student.subjectOfInterest}</p>
              {relevantSubjects.length > 0 && (
                <div className="mt-2">
                  <p className="text-green-700 font-medium">
                    📚 Materias que puedes enseñarle:
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {relevantSubjects.map((subject) => (
                      <span
                        key={subject.id}
                        className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                      >
                        {subject.name} ({subject.pricePerHour} COP (Pesos Colombianos)/hr)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <a
          href={`mailto:${student.email}?subject=Oferta de preparación en ${student.subjectOfInterest}&body=Hola ${student.firstName},%0A%0AHe visto tu interés en ${student.subjectOfInterest} y me gustaría ofrecerte mis servicios de preparación.%0A%0ASoy ${tutor.firstName} ${tutor.lastName}, ${tutor.tutorType === 'unet' ? 'profesor de UNET' : 'preparador privado'}.%0A%0AMis datos:%0AEmail: ${tutor.email}%0A%0A¡Espero tu respuesta!`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <Mail className="h-4 w-4" />
          <span>Contactar</span>
        </a>
      </div>
    </div>
  );
};

export default TutorDashboard;