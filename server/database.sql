CREATE DATABASE bpl;

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

-- -- Teams Table (Adjusted to reference users with UUID)
CREATE TABLE teams (
    team_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    member1_id uuid,
    member2_id uuid,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    FOREIGN KEY (member1_id) REFERENCES profiles (profile_id),
    FOREIGN KEY (member2_id) REFERENCES profiles (profile_id)
);

-- -- Matches Table (Adjusted to reference brackets)
CREATE TABLE matches (
    match_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    bracket_id uuid NOT NULL,
    location VARCHAR(255),
    team1_id uuid,
    team2_id uuid,
    winner_id uuid,
    home_team_id uuid,
    match_date DATE,
    status VARCHAR(255),
    next_match_id uuid,
    round VARCHAR(255),
    round_index INTEGER,
    match_in_round_index INTEGER, --in a particular round, waht is the index
    FOREIGN KEY (bracket_id) REFERENCES brackets(bracket_id),
    FOREIGN KEY (team1_id) REFERENCES teams(team_id),
    FOREIGN KEY (team2_id) REFERENCES teams(team_id),
    FOREIGN KEY (winner_id) REFERENCES teams(team_id),
    FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
    FOREIGN KEY (next_match_id) REFERENCES matches(match_id)
);

-- sets within matches
CREATE TABLE match_sets (
    set_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    match_id uuid NOT NULL,
    set_number INT NOT NULL,
    score_team1 INT,
    score_team2 INT,
    winning_team_id uuid,
    overtime INT DEFAULT 0,
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
    UNIQUE (match_id, set_number)  -- Ensures each set number is unique within a match
);

-- -- Brackets Table
CREATE TABLE brackets (
    bracket_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id uuid NOT NULL,
    name VARCHAR(255) DEFAULT 'Unnamed' NOT NULL,
    start_date DATE,
    end_date DATE,
    bracket_type VARCHAR(255) DEFAULT 'single elimination' NOT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id)
);

-- Tournaments Table
CREATE TABLE tournaments (
    tournament_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    register_is_open BOOLEAN DEFAULT true
);

-- -- Tournament Teams Table (to handle many-to-many relationship between tournaments and teams)
CREATE TABLE tournament_teams (
    tournament_id uuid,
    team_id uuid,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    PRIMARY KEY (tournament_id, team_id)
);

-- -- Bracket Teams Table (to handle many-to-many relationship between brackets and teams)
CREATE TABLE bracket_teams (
    bracket_id uuid,
    team_id uuid,
    FOREIGN KEY (bracket_id) REFERENCES brackets(bracket_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    PRIMARY KEY (bracket_id, team_id)
);

