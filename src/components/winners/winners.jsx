import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

const Winners = ({ winners }) => {
  const winnersList = winners.map((item, index) => (
    <li className="winners-list-item" key={index}>
      <div>{item.winner}</div>
      <div>{item.date}</div>
    </li>));

  return (
    <div className="winners">
      <div className="winners-title-wrapper">
        <div>Leader Board</div>
      </div>
      <ul className="winners-list">
        {winnersList}
      </ul>
    </div>
  );
};

Winners.defaultProps = {
  winners: PropTypes.arrayOf(),
};

Winners.propTypes = {
  winners: PropTypes.arrayOf(
    PropTypes.shape({
      winner: PropTypes.string,
      date: PropTypes.string,
    }),
  ),
};

export default Winners;
