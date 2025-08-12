import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Student, Tutor, Subject } from '../types';
import { careers, subjects } from '../data/mockData';
import ImageUpload from '../components/common/ImageUpload';
import { UserPlus, AlertCircle, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'tutor' | ''>('');
  const [formData, setFormData] = useState({
    idCard: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Student specific
    career: '',
    subjectOfInterest: '',
    // Tutor specific
    tutorType: 'unet' as 'unet' | 'private',
  });
  const [tutorSubjects, setTutorSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const validateStep1 = () => {
    if (!role) {
      setError('Por favor selecciona un tipo de perfil');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { idCard, firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!idCard || !firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (role === 'student' && (!formData.career || !formData.subjectOfInterest)) {
      setError('Por favor completa todos los campos del estudiante');
      return false;
    }

    if (role === 'tutor' && tutorSubjects.length === 0) {
      setError('Por favor agrega al menos una materia que puedas enseñar');
      return false;
    }

    if (role === 'tutor') {
      for (const subject of tutorSubjects) {
        if (!subject.name || subject.pricePerHour <= 0) {
          setError('Por favor completa todos los campos de las materias');
          return false;
        }
      }
    }

    return true;
  };

  const handleNext = () => {
    setError('');
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateStep2()) {
      setIsLoading(false);
      return;
    }

    // ✅ Validar que el email sea @unet.edu.ve
    if (!formData.email || !formData.email.toLowerCase().endsWith('@unet.edu.ve')) {
      setError('El correo debe pertenecer a la UNET, contacte con soporte si es un egresado');
      setIsLoading(false);
      return;
    }

    const baseUserData = {
      idCard: formData.idCard,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      img: profileImage || undefined,
      role,
    };

    let userData: Omit<User, 'id' | 'createdAt'>;

    if (role === 'student') {
      userData = {
        ...baseUserData,
        role: 'student',
        career: formData.career,
        subjectOfInterest: formData.subjectOfInterest,
      } as Omit<Student, 'id' | 'createdAt'>;
    } else {
      userData = {
        ...baseUserData,
        role: 'tutor',
        tutorType: formData.tutorType,
        subjects: tutorSubjects,
      } as Omit<Tutor, 'id' | 'createdAt'>;
    }

    const success = register(userData);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Este correo electrónico ya está registrado');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Tipo de Perfil</span>
              <span>Información Personal</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-3 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¿Cómo te quieres registrar?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-6 border-2 rounded-lg text-left transition-colors ${
                    role === 'student'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">Estudiante</h4>
                  <p className="text-sm text-gray-600">
                    Busca preparadores para mejorar en materias específicas
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`p-6 border-2 rounded-lg text-left transition-colors ${
                    role === 'tutor'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-2">Preparador</h4>
                  <p className="text-sm text-gray-600">
                    Ofrece clases y preparaciones en tu área de experticia
                  </p>
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Información {role === 'student' ? 'del Estudiante' : 'del Preparador'}
                </h3>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  ← Atrás
                </button>
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">
                    Cédula de Identidad *
                  </label>
                  <input
                    id="idCard"
                    name="idCard"
                    type="text"
                    value={formData.idCard}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="V-12345678"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu apellido"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tu.email@unet.edu.ve"
                    required
                  />
                </div>
              </div>

              {/* Profile Image Upload */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Imagen de Perfil (Opcional)
                </label>
                <ImageUpload
                  currentImage={profileImage || undefined}
                  onImageChange={setProfileImage}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              {role === 'student' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-1">
                      Carrera Universitaria *
                    </label>
                    <select
                      id="career"
                      name="career"
                      value={formData.career}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona tu carrera</option>
                      {careers.map(career => (
                        <option key={career} value={career}>{career}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subjectOfInterest" className="block text-sm font-medium text-gray-700 mb-1">
                      Materia de Interés *
                    </label>
                    <select
                      id="subjectOfInterest"
                      name="subjectOfInterest"
                      value={formData.subjectOfInterest}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecciona una materia</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {role === 'tutor' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de Preparador *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Materias que Enseñas *
                      </label>
                      <button
                        type="button"
                        onClick={addSubject}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Agregar Materia</span>
                      </button>
                    </div>
                    
                    {tutorSubjects.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-4 border border-dashed border-gray-300 rounded-md">
                        No has agregado materias aún. Haz clic en "Agregar Materia" para comenzar.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tutorSubjects.map((subject, index) => (
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
                              type="button"
                              onClick={() => removeSubject(subject.id)}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;