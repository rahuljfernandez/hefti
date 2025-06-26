import React from 'react';
/**
 *This is used in the auto- suggestions feature.  When user types "comp", as in "company", then the suggestions will display "comp" in bold.
 *
 * @param {string} text -The full suggestion value string
 * @param {string} query -The user input string
 * @returns {JSX.Element|string} A React fragment with bolded match, or the original text if no match.
 */

export function highlightQuery(text, query) {
  if (!query) return text;

  //finds the idex position for the query within text
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <span className="font-extrabold">
        {text.slice(index, index + query.length)}
      </span>
      {text.slice(index + query.length)}
    </>
  );
}
