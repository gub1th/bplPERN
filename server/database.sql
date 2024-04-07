CREATE DATABASE bpl;

-- CREATE TABLE users(
--     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     first_name VARCHAR(255) NOT NULL,
--     last_name VARCHAR(255) NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     password VARCHAR(255) NOT NULL,
--     UNIQUE (email)
-- );

-- -- insert fake users
-- INSERT INTO users (first_name, last_name, email, password) VALUES ('daniel', 'gunawan', 'dg@gmail.com', 'cat123');

-- users table
CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    roles TEXT[] DEFAULT ARRAY['Player']::TEXT[],
    is_active BOOLEAN DEFAULT true,
    registered_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- profiles table
CREATE TABLE profiles (
    profile_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id uuid,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- -- Teams Table
-- CREATE TABLE teams (
--     team_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     member1_id INT,
--     member2_id INT,
--     name VARCHAR(255),
--     is_active BOOLEAN,
--     FOREIGN KEY (member1_id) REFERENCES users(user_id),
--     FOREIGN KEY (member2_id) REFERENCES users(user_id)
-- );

-- -- Tournaments Table
-- CREATE TABLE tournaments (
--     tournament_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255),
--     tournament_date DATE
-- );

-- -- Tournament Teams Table (to handle many-to-many relationship between tournaments and teams)
-- CREATE TABLE tournament_teams (
--     tournament_id uuid,
--     team_id uuid,
--     FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
--     FOREIGN KEY (team_id) REFERENCES teams(team_id),
--     PRIMARY KEY (tournament_id, team_id)
-- );

-- -- Matches Table
-- CREATE TABLE matches (
--     match_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     team1_id uuid,
--     team2_id uuid,
--     tournament_id INT,
--     match_date DATE,
--     score_team1 INT,
--     score_team2 INT,
--     FOREIGN KEY (team1_id) REFERENCES teams(team_id),
--     FOREIGN KEY (team2_id) REFERENCES teams(team_id),
--     FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
-- );

