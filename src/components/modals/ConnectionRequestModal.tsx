import React, { useState } from 'react';
import { Student, Tutor } from '../../types';
import { useConnections } from '../../contexts/ConnectionContext';
import { X, Send, CheckCircle } from 'lucide-react';

interface ConnectionRequestModalProps {
  tutor: Tutor;
  student: Student;
  onClose: () => void;
}

const ConnectionRequestModal: React.FC<ConnectionRequestModalProps> = ({
  tutor,
  student,
  onClose,
}) => {
  const { sendConnectionRequest } = useConnections();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSendRequest = async () => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = sendConnectionRequest(tutor.id);
    
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
    
    setIsLoading(false);
  };

  const relevantSubjects = tutor.subjects.filter(subject =>
    subject.name.toLowerCase().includes(student.subjectOfInterest.toLowerCase()) ||
    student.subjectOfInterest.toLowerCase().includes(subject.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Solicitar Conexión
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
              ¡Solicitud Enviada!
            </h3>
            <p className="text-gray-600">
              Tu solicitud ha sido enviada a {tutor.firstName}. Te notificaremos cuando responda.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {tutor.firstName} {tutor.lastName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {tutor.tutorType === 'unet' ? 'Preparador' : 'Clases Privadas'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {tutor.email}
                </p>
              </div>

              {relevantSubjects.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Materias relevantes para ti:
                  </h4>
                  <div className="space-y-2">
                    {relevantSubjects.map((subject) => (
                      <div key={subject.id} className="bg-green-50 border border-green-200 rounded-md p-2">
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

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Tu información:
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Nombre:</strong> {student.firstName} {student.lastName}</p>
                  <p><strong>Carrera:</strong> {student.career}</p>
                  <p><strong>Interés:</strong> {student.subjectOfInterest}</p>
                  <p><strong>Email:</strong> {student.email}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar Solicitud</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionRequestModal;