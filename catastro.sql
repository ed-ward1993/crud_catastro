-- Version 1.0

-- Creación de la tabla Tipo de documento 
CREATE TABLE Tipo_documento (
  id INT PRIMARY KEY,
  nombre VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla Tipo de personas 
CREATE TABLE Tipo_persona (
  id INT PRIMARY KEY,
  nombre VARCHAR(255),
  estado BOOLEAN DEFAULT true
);
-- persona_natural persona_juridica

-- Creación de la tabla Tipo de contruccion 
CREATE TABLE Tipo_construccion (
  id INT PRIMARY KEY,
  nombre VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- industrial comercial residencial

-- Creación de la tabla Tipo_terreno
CREATE TABLE Tipo_terreno (
  id INT PRIMARY KEY,
  nombre VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla Predio con numero_predial como llave primaria y id como llave primaria incremental adicional
CREATE TABLE Predio (
  numero_predial SERIAL PRIMARY KEY,
  avaluo DECIMAL(10, 2),
  nombre VARCHAR(255),
  departamento VARCHAR(255),
  municipio VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla Propietario
CREATE TABLE Propietario (
  id_propietario SERIAL PRIMARY KEY,
  numero_documento VARCHAR(20),
  nit VARCHAR(20),
  razon_social VARCHAR(255),
  direccion VARCHAR(255),
  telefono VARCHAR(20),
  correo_electronico VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla Construccion
CREATE TABLE Construccion (
  id_construccion SERIAL PRIMARY KEY,
  numero_pisos INT,
  area_total DECIMAL(10, 2),
  direccion_construccion VARCHAR(255),
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla Terreno
CREATE TABLE Terreno (
  id_terreno SERIAL PRIMARY KEY,
  area DECIMAL(10, 2),
  valor_comercial DECIMAL(10, 2),
  cerca_fuentes_agua BOOLEAN,
  tiene_construcciones BOOLEAN,
  estado BOOLEAN DEFAULT true
);

-- Creación de la tabla PropietarioPredio para representar la relación muchos a muchos entre Propietario y Predio
CREATE TABLE PropietarioPredio (
  id_propietario_predio SERIAL PRIMARY KEY,
  id_predio INT,
  id_propietario INT,
  FOREIGN KEY (id_predio) REFERENCES Predio (numero_predial),
  FOREIGN KEY (id_propietario) REFERENCES Propietario (id_propietario)
);

-- Creación de la tabla ConstruccionPredio para representar la relación muchos a muchos entre Construcciones y Predio
CREATE TABLE ConstruccionPredio (
  id_construccion_predio SERIAL PRIMARY KEY,
  numero_predial INT,
  id_construccion INT,
  FOREIGN KEY (numero_predial) REFERENCES Predio (numero_predial),
  FOREIGN KEY (id_construccion) REFERENCES Construccion (id_construccion)
);

-- Establecimiento de la relación uno a uno entre Predio y Terreno
ALTER TABLE Predio
ADD COLUMN id_terreno INT,
ADD FOREIGN KEY (id_terreno) REFERENCES Terreno (id_terreno);

-- Establecimiento de la relación uno a muchos entre Tipo_documento y Propietario
ALTER TABLE Propietario
ADD COLUMN id_tipo_documento INT,
ADD FOREIGN KEY (id_tipo_documento) REFERENCES Tipo_documento (id);

-- Establecimiento de la relación uno a muchos entre Tipo_documento y Propietario
ALTER TABLE Propietario
ADD COLUMN id_tipo_persona INT,
ADD FOREIGN KEY (id_tipo_persona) REFERENCES Tipo_persona (id);

-- Establecimiento de la relación uno a muchos entre Tipo_construccion y Construccion
ALTER TABLE Construccion
ADD COLUMN id_tipo_construccion INT,
ADD FOREIGN KEY (id_tipo_construccion) REFERENCES Tipo_construccion (id);

-- Establecimiento de la relación uno a uno entre Predio y Terreno
ALTER TABLE Terreno
ADD COLUMN id_tipo_terreno INT,
ADD FOREIGN KEY (id_tipo_terreno) REFERENCES Tipo_terreno (id);




-- Primera insercion

INSERT INTO Tipo_documento (id, nombre, estado)
VALUES
  (1, 'Cédula de ciudadanía', true),  
  (2, 'Pasaporte', true),
  (3, 'Cédula de extranjería', true),
  (4, 'Registro civil', true),
  (5, 'NIT', true);
  
 INSERT INTO Tipo_persona (id, nombre, estado)
VALUES
  (1, 'Persona natural', true),
  (2, 'Persona jurídica', true);
  
 INSERT INTO Tipo_construccion (id, nombre, estado)
VALUES
  (1, 'Industrial', true),
  (2, 'Comercial', true),
  (3, 'Residencial', true);
  
 INSERT INTO Tipo_terreno (id, nombre, estado)
VALUES
  (1, 'Rural', true),
  (2, 'Urbano', true);
  
 INSERT INTO Propietario (id_propietario, numero_documento, nit, razon_social, direccion, telefono, correo_electronico, estado, id_tipo_documento, id_tipo_persona)
VALUES
  (1, '12345678', null, 'Juan Pérez', 'Calle 123, Ciudad', '+123456789', 'juan@example.com', true,1, 1),
  (2,  null, '901234567', 'Empresa ABC', 'Av. Principal, Ciudad', '+987654321', 'contacto@empresaabc.com', true,5,2),
  (3, '87654321', null, 'María Gómez', 'Plaza 456, Ciudad', '+456789012', 'maria@example.com', true,1, 1),
  (4,  null, '765432109', 'Compañía XYZ', 'Carretera 789, Ciudad', '+987012345', 'info@companiaxyz.com', true,5,2),
  (5, '98765432', null, 'Pedro Ramírez', 'Avenida 789, Ciudad', '+654321098', 'pedro@example.com', true,1, 1);

  INSERT INTO Construccion (id_construccion, numero_pisos, area_total, direccion_construccion, estado, id_tipo_construccion)
VALUES
  (1, 3, 200.00, 'Calle 1, Ciudad', true, 3),
  (2, 1, 100.50, 'Avenida 2, Ciudad', true,3),
  (3, 4, 300.75, 'Plaza 3, Ciudad', true,2),
  (4, 2, 150.25, 'Carretera 4, Ciudad', true,1 ),
  (5, 5, 400.00, 'Avenida 5, Ciudad', true,2);
 
 
  INSERT INTO Terreno (id_terreno, area, valor_comercial, cerca_fuentes_agua, tiene_construcciones, estado, id_tipo_terreno)
VALUES
  (1, 500.00, 25000.00, true, false, true,1),
  (2, 750.25, 40000.00, false, true, true,1),
  (3, 300.50, 18000.00, true, false, true,2),
  (4, 1000.00, 60000.00, false, true, true,1),
  (5, 800.75, 35000.00, true, true, true,2); 

  INSERT INTO Predio (numero_predial, avaluo, nombre, departamento, municipio, estado,id_terreno)
VALUES
  (1, 50000.00, 'Predio 1', 'Departamento 1', 'Municipio 1', true,3),
  (2, 75000.00, 'Predio 2', 'Departamento 2', 'Municipio 2', true,4),
  (3, 120000.00, 'Predio 3', 'Departamento 1', 'Municipio 3', true,2),
  (4, 90000.00, 'Predio 4', 'Departamento 3', 'Municipio 4', true,5),
  (5, 65000.00, 'Predio 5', 'Departamento 2', 'Municipio 5', true,1);
  

 
SELECT MAX(numero_predial) FROM Predio;
ALTER SEQUENCE predio_numero_predial_seq RESTART WITH 6;

SELECT MAX(id_propietario) FROM propietario p;
ALTER SEQUENCE propietario_id_propietario_seq RESTART WITH 6;

SELECT MAX(id_construccion) FROM construccion c;
ALTER SEQUENCE construccion_id_construccion_seq RESTART WITH 6;

SELECT MAX(id_terreno)  FROM terreno t; 
ALTER SEQUENCE terreno_id_terreno_seq RESTART WITH 6;