import React from 'react';

const Winners = ({ winners }) => {
    const winnersList = winners.map((item, index) => <li key={index}>{item.winner} {item.date}</li>)
    return (
        <ul>
            {winnersList}
        </ul>
    );
}

export default Winners;
