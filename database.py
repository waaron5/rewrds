# database.py - Defines and creates the initial database structure

import sqlite3

def setup_database():
    # 1. Connect to the database file (it creates the file 'cards.db' if it doesn't exist)
    conn = sqlite3.connect('cards.db')
    cursor = conn.cursor()

    # 2. Table for Mainstream/Niche Cards (General card details)
    # This table stores the fixed attributes of each credit card.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cards (
            card_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            issuer TEXT NOT NULL,
            annual_fee REAL,
            sign_up_bonus TEXT,
            points_value REAL,  -- e.g., 0.01 for 1 cent/point
            link TEXT,
            data_source TEXT    -- e.g., 'CJ_API' or 'Manual_Research'
        );
    """)

    # 3. Table for Specific Rewards Categories (The core optimization logic)
    # This table stores the varying reward rates (e.g., 5x on gas, 3x on dining)
    # The FOREIGN KEY links a reward rule back to a specific card in the 'cards' table.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rewards (
            reward_id INTEGER PRIMARY KEY,
            card_name TEXT,
            category TEXT,  -- e.g., 'Gas', 'Dining', 'Streaming', 'Credit Union ATM'
            multiplier REAL,  -- e.g., 5.0 for 5x points
            max_spend INTEGER,  -- e.g., 6000 (if the 5x is capped at $6000/year)
            FOREIGN KEY(card_name) REFERENCES cards(name)
        );
    """)

    # 4. Save (commit) the changes and close the connection
    conn.commit()
    conn.close()
    print("Database 'cards.db' and tables created successfully.")

if __name__ == '__main__':
    setup_database()