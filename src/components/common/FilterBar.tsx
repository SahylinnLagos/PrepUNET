import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedTutorType: string;
  onTutorTypeChange: (value: string) => void;
  selectedCareer: string;
  onCareerChange: (value: string) => void;
  subjects: string[];
  careers: string[];
  showTutorFilters?: boolean;
  showStudentFilters?: boolean;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedTutorType,
  onTutorTypeChange,
  selectedCareer,
  onCareerChange,
  subjects,
  careers,
  showTutorFilters = false,
  showStudentFilters = false,
  onClearFilters,
}) => {
  const hasActiveFilters = searchTerm || selectedSubject || selectedTutorType || selectedCareer;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Limpiar Filtros</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search by name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por nombre
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Nombre o apellido..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Subject filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {showTutorFilters ? 'Materia que enseña' : 'Materia de interés'}
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las materias</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {/* Tutor type filter (only for tutors) */}
        {showTutorFilters && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de preparador
            </label>
            <select
              value={selectedTutorType}
              onChange={(e) => onTutorTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              <option value="unet">Preparador</option>
              <option value="private">Clases Privadas</option>
            </select>
          </div>
        )}

        {/* Career filter (only for students) */}
        {showStudentFilters && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Carrera
            </label>
            <select
              value={selectedCareer}
              onChange={(e) => onCareerChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las carreras</option>
              {careers.map(career => (
                <option key={career} value={career}>{career}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Nombre: "{searchTerm}"
              </span>
            )}
            {selectedSubject && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Materia: {selectedSubject}
              </span>
            )}
            {selectedTutorType && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Tipo: {selectedTutorType === 'unet' ? 'Preparador' : 'Clases Privadas'}
              </span>
            )}
            {selectedCareer && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Carrera: {selectedCareer}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;