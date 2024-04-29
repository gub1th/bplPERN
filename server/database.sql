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
    google_id VARCHAR(255) UNIQUE,
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
    image_url TEXT,
    nickname VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    opt_in BOOLEAN DEFAULT false,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

CREATE TABLE individual_rankings (
    ranking_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ranked_by_profile_id uuid NOT NULL,
    ranked_profile_id uuid NOT NULL,
    rank INTEGER NOT NULL,
    FOREIGN KEY (ranked_by_profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE,
    FOREIGN KEY (ranked_profile_id) REFERENCES profiles(profile_id) ON DELETE CASCADE
);

-- -- Tournaments Table
-- CREATE TABLE tournaments (
--     tournament_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     name VARCHAR(255),
--     tournament_date DATE,
-- );

-- -- Brackets Table
-- CREATE TABLE brackets (
--     bracket_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     tournament_id uuid NOT NULL,
--     bracket_type VARCHAR(255) NOT NULL,
--     bracket_stage VARCHAR(255),
--     tournament_type VARCHAR(255) CHECK (tournament_type IN ('round_robin', 'single_elimination', 'double_elimination')),
--     FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
-- );

-- -- Teams Table (Adjusted to reference users with UUID)
-- CREATE TABLE teams (
--     team_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     member1_id uuid,
--     member2_id uuid,
--     name VARCHAR(255),
--     is_active BOOLEAN DEFAULT true,
--     FOREIGN KEY (member1_id) REFERENCES users(user_id),
--     FOREIGN KEY (member2_id) REFERENCES users(user_id)
-- );

-- -- Tournament Teams Table (to handle many-to-many relationship between tournaments and teams)
-- CREATE TABLE tournament_teams (
--     tournament_id uuid,
--     team_id uuid,
--     FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
--     FOREIGN KEY (team_id) REFERENCES teams(team_id),
--     PRIMARY KEY (tournament_id, team_id)
-- );

-- -- Matches Table (Adjusted to reference brackets)
-- CREATE TABLE matches (
--     match_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     bracket_id uuid NOT NULL,
--     team1_id uuid,
--     team2_id uuid,
--     match_date TIMESTAMP WITHOUT TIME ZONE,
--     score_team1 INT,
--     score_team2 INT,
--     FOREIGN KEY (bracket_id) REFERENCES brackets(bracket_id),
--     FOREIGN KEY (team1_id) REFERENCES teams(team_id),
--     FOREIGN KEY (team2_id) REFERENCES teams(team_id)
-- );

