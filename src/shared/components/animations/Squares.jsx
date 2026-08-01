'use client';
// Styles
import './styles/Squares.css';

/* Animación de Cuadrados Flotantes de Vidrio */
export const Squares = () => (
  <div className="relative top-32">
    <div className="relative squares">
      <li
        className="absolute z-30 -top-28 left-36 flex flex-col items-center justify-center"
        style={{ "--i": "1" }}
      ></li>
      <li className="absolute z-30 top-20 -left-72" style={{ "--i": "2" }}></li>
      <li className="absolute top-60 left-44 z-10" style={{ "--i": "3" }}></li>
      <li className="absolute z-30 top-96 -left-24" style={{ "--i": "4" }}></li>
      <li
        className="absolute z-10 -top-36 -left-12"
        style={{ "--i": "5" }}
      ></li>
    </div>
  </div>
);