import React, { useContext } from "react";
import {Link} from "react-router-dom";


export default function Header() {

    return (
      <div>
        <h2>Which Element Are You?</h2>
        <h2>"(based on completely random things)"</h2>
        <div className="links">
        <p>
        <Link to="/" className="link1">Home </Link>       
        <Link to="/quiz">Quiz</Link>       
        </p>
        </div>
      </div>
    );
  }