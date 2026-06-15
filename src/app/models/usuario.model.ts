export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  password?: string;
  rol: 'Líder' | 'Senior' | 'Coordinador' | 'Administrador' | 'Super Administrador' | 'PMO';
  estado: 'Activo' | 'Inactivo';
  departamento: string;
  telefono?: string;
  foto?: string;
  
  // Capacidad
  capacidadTotal?: number;
  capacidadDisponible?: number;
  
  // Auditoría
  fechaCreacion?: Date;
  fechaUltimaConexion?: Date;
  permiso?: string[];
}

export interface CredencialLogin {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  usuario: Usuario;
  expiresIn: number;
}

export interface Permiso {
  _id?: string;
  nombre: string;
  descripcion: string;
  código: string;
}