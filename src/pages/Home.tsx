import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GraduationCap, Users, BookOpen, Star, ArrowRight, CheckCircle, MessageCircle } from 'lucide-react';
import teamData from '../data/teamData';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/PrepUNET/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <GraduationCap className="h-16 w-16 mx-auto text-blue-600 mb-4" />
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              PrepUNET
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              La plataforma líder para conectar estudiantes con preparadores especializados en la Universidad Nacional Experimental del Táchira
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/PrepUNET/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/PrepUNET/login"
              className="text-blue-600 hover:text-blue-800 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:border-blue-800 transition-colors"
            >
              Iniciar Sesión
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Estudiantes Registrados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Preparadores Certificados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Materias Disponibles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Cómo funciona PrepUNET?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Conecta</h3>
              <p className="text-gray-600">
                Encuentra preparadores certificados UNET y privados, o estudiantes que buscan apoyo académico especializado
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Aprende</h3>
              <p className="text-gray-600">
                Recibe preparaciones personalizadas con chat integrado y seguimiento continuo de tu progreso académico
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Destaca</h3>
              <p className="text-gray-600">
                Mejora tus calificaciones con sistema de reseñas y calificaciones que garantiza la calidad del servicio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Características Principales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Conexiones Verificadas</h4>
              <p className="text-sm text-gray-600">
                Sistema de códigos únicos para garantizar conexiones auténticas
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Chat Integrado</h4>
              <p className="text-sm text-gray-600">
                Comunicación directa entre estudiantes y preparadores
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold mb-2">Sistema de Reseñas</h4>
              <p className="text-sm text-gray-600">
                Califica y comenta la experiencia con tus preparadores
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="font-semibold mb-2">Perfiles Detallados</h4>
              <p className="text-sm text-gray-600">
                Información completa de preparadores y especialidades
              </p>
            </div>
          </div>
        </div>
      </section>

       {/* About Us Section */}
       <section className="py-20 px-4 bg-gradient-to-br from-blue-50 via-gray-200 to-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Acerca de nosotros
            </h2>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <p className="text-lg text-gray-700 leading-relaxed">
                Con el objetivo de resolver la dificultad que tienen los estudiantes para encontrar preparadores adecuados, se presenta PrepUNET, una plataforma web innovadora que centraliza la información de los preparadores, permitiendo a los estudiantes filtrar por materia, tema, aula, experiencia, disponibilidad, tipo de clase y calificación, buscando así una mejora y efectividad en las preparadurías de la universidad.              
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Nuestro Equipo
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamData.team.map((member:any, index:any) => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-2xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-6 relative">
                    <div className="relative inline-block">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-[200px] h-[200px] rounded-full mx-auto object-cover border-4 border-blue-200 shadow-xl group-hover:border-blue-400 transition-colors duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-2 shadow-lg">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-full text-sm inline-block">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Listo para transformar tu experiencia académica?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Únete a cientos de estudiantes y preparadores que ya confían en PrepUNET
          </p>
          <Link
            to="/PrepUNET/register"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <span>Crear Cuenta Gratis</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;