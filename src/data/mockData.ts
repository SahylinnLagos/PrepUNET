import { Student, Tutor } from '../types';
import a from "../assets/1.png";
import b from "../assets/2.png";
import c from "../assets/3.jpg";
import d from "../assets/4.jpg";
import e from "../assets/5.jpg";
import f from "../assets/6.jpg";
import g from "../assets/7.jpg";
import h from "../assets/8.jpg";

export const mockStudents: Student[] = [
  {
    id: '1',
    idCard: '27123456',
    firstName: 'Liu',
    lastName: 'Wang',
    email: 'liu.wang@unet.edu.ve',
    img: f,
    password: 'student123',
    role: 'student',
    career: 'Ingeniería de Sistemas',
    subjectOfInterest: 'Programación',
    genero: 'masculino',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    idCard: '26987654',
    firstName: 'Carla',
    lastName: 'Rodríguez',
    email: 'carla.rodriguez@unet.edu.ve',
    img: g,
    password: 'student123',
    role: 'student',
    career: 'Ingeniería Industrial',
    subjectOfInterest: 'Matemáticas',
    genero: 'femenino',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    idCard: '26987654',
    firstName: 'Ana',
    lastName: 'Ramirez',
    email: 'ana.ramirez@unet.edu.ve',
    img: h,
    password: 'student123',
    role: 'student',
    career: 'Ingeniería Industrial',
    subjectOfInterest: 'Matemáticas',
    genero: 'femenino',
    createdAt: new Date().toISOString(),
  },
];

export const mockTutors: Tutor[] = [
  {
    id: '3',
    idCard: '12345678',
    firstName: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@unet.edu.ve',
    img: a,
    password: 'tutor123',
    role: 'tutor',
    tutorType: 'private',
    genero: 'femenino',
    subjects: [
      { id: '1', name: 'Dibujo I', pricePerHour: 4000 },
    ],
    date: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    idCard: '98765432',
    firstName: 'Luis',
    lastName: 'Pérez',
    email: 'luis.perez@unet.edu.ve',
    img: b,
    password: 'tutor123',
    role: 'tutor',
    tutorType: 'private',
    genero: 'masculino',
    subjects: [
      { id: '4', name: 'Programación en Java', pricePerHour: 5500 },
      { id: '5', name: 'Estructuras de Datos', pricePerHour: 5000 },
      { id: '8', name: 'Física II', pricePerHour: 5000 },
    ],
    date: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    idCard: '15975348',
    firstName: 'Carmen',
    lastName: 'Silva',
    email: 'carmen.silva@unet.edu.ve',
    img: c,
    password: 'tutor123',
    role: 'tutor',
    tutorType: 'unet',
    genero: 'feminino',
    subjects: [
      { id: '7', name: 'Matemática I', pricePerHour: 4000 },
      { id: '8', name: 'Matemática II', pricePerHour: 5000 },
    ],
    date: 'miércoles - jueves de 10am a 12pm en el salón 8B',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    idCard: '15975348',
    firstName: 'Julian',
    lastName: 'Parra',
    email: 'juliana.parra@unet.edu.ve',
    img: d,
    password: 'tutor123',
    role: 'tutor',
    tutorType: 'unet',
    genero: 'masculino',
    subjects: [
      { id: '7', name: 'Física I', pricePerHour: 4000 },
      { id: '8', name: 'Física II', pricePerHour: 5000 },
    ],
    date: 'lunes - miércoles de 8am a 10am en el salón 5A',
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    idCard: '15975348',
    firstName: 'Juan',
    lastName: 'Martinez',
    email: 'carmen.silva@unet.edu.ve',
    img: e,
    password: 'tutor123',
    role: 'tutor',
    tutorType: 'unet',
    genero: 'masculino',
    subjects: [
      { id: '7', name: 'Química I', pricePerHour: 4000 },
      { id: '8', name: 'Química II', pricePerHour: 5000 },
    ],
    date: 'jueves - viernes de 3pm a 5pm en el salón 18A',
    createdAt: new Date().toISOString(),
  },
];

export const careers = [
  'Ingeniería Informatica',
  'Ingeniería Industrial',
  'Ingeniería Electrónica',
  'Ingeniería Agronómica',
  'Ingeniería En Producción Animal',
  'Ingeniería Ambiental',
  'Ingeniería Mecánica',
  'Ingeniería Civil',
  'Arquitectura',
  'Psicologia',
];

export const subjects = [
  'Matemáticas',
  'Física',
  'Química',
  'Programación',
  'Estadística',
  'Dibujo',
  'Ingles',
  'Base de Datos',
  'Estructuras de Datos',
  'Ingeniería de Software',
  'Sistemas Operativos',
];