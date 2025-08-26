import React, { useState, useEffect } from 'react';

const TableExerciseRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback 
}) => {
  const [tableAnswers, setTableAnswers] = useState({});

  useEffect(() => {
    if (userAnswers && userAnswers.tableAnswers) {
      setTableAnswers(userAnswers.tableAnswers);
    }
  }, [userAnswers]);

  const handleCellChange = (rowId, columnId, value) => {
    if (isAnswered) return;

    const cellKey = `${rowId}_${columnId}`;
    const newTableAnswers = {
      ...tableAnswers,
      [cellKey]: value
    };

    setTableAnswers(newTableAnswers);
    onAnswerChange({
      tableAnswers: newTableAnswers,
      type: 'table'
    });
  };

  const { content, presentation } = universalData;
  const table = content.elements.table;
  const headers = table.headers || [];
  const rows = table.rows || [];

  const getCellValue = (rowId, columnId) => {
    const cellKey = `${rowId}_${columnId}`;
    return tableAnswers[cellKey] || '';
  };

  const isCellCorrect = (rowId, columnId, userValue) => {
    const correctAnswer = content.solution.correctAnswers?.[`${rowId}_${columnId}`];
    return correctAnswer && userValue.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
  };

  return (
    <div className={presentation?.styles?.container || "relative bg-white pt-3 sm:pt-5 px-2 sm:px-4"}>
      {/* Question */}
      {content.text.question && (
        <div className={presentation?.styles?.question || "text-lg sm:text-xl font-bold text-green-600 mb-6 text-center"}>
          {content.text.question}
        </div>
      )}

      {/* Instruction */}
      {content.text.instruction && (
        <div className="text-base sm:text-lg text-gray-700 mb-8 text-center">
          {content.text.instruction}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse border-2 border-gray-300 bg-white rounded-lg shadow-sm">
          {/* Table Headers */}
          {headers.length > 0 && (
            <thead>
              <tr className="bg-blue-50">
                {headers.map((header, index) => (
                  <th 
                    key={index}
                    className="border border-gray-300 px-4 py-3 text-left font-bold text-blue-800"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          {/* Table Body */}
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.cells.map((cell, cellIndex) => {
                  const columnId = headers[cellIndex] || `col_${cellIndex}`;
                  const rowId = row.id || `row_${rowIndex}`;
                  
                  if (cell.type === 'input') {
                    const userValue = getCellValue(rowId, columnId);
                    const showCorrectness = showFeedback && isAnswered;
                    const isCorrectAnswer = showCorrectness ? isCellCorrect(rowId, columnId, userValue) : false;

                    let inputClasses = `
                      w-full px-3 py-2 border-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                      ${!isAnswered ? 'bg-white' : 'bg-gray-100'}
                    `;

                    if (showCorrectness) {
                      if (isCorrectAnswer) {
                        inputClasses += ' border-green-500 bg-green-50';
                      } else {
                        inputClasses += ' border-red-500 bg-red-50';
                      }
                    } else {
                      inputClasses += ' border-gray-300';
                    }

                    return (
                      <td key={cellIndex} className="border border-gray-300 px-2 py-2">
                        <input
                          type="text"
                          value={userValue}
                          onChange={(e) => handleCellChange(rowId, columnId, e.target.value)}
                          disabled={isAnswered}
                          placeholder={cell.placeholder || 'Enter answer...'}
                          className={inputClasses}
                        />
                        {showCorrectness && !isCorrectAnswer && userValue && (
                          <div className="text-xs text-red-600 mt-1">
                            Correct: {content.solution.correctAnswers?.[`${rowId}_${columnId}`]}
                          </div>
                        )}
                      </td>
                    );
                  } else {
                    // Static cell content
                    return (
                      <td key={cellIndex} className="border border-gray-300 px-4 py-3">
                        {cell.content}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Progress Indicator */}
      {!isAnswered && (
        <div className="text-center">
          <div className="text-sm text-gray-500">
            Fields completed: {Object.keys(tableAnswers).filter(key => tableAnswers[key].trim()).length} / {
              rows.reduce((total, row) => 
                total + row.cells.filter(cell => cell.type === 'input').length, 0
              )
            }
          </div>
        </div>
      )}

      {/* Table Legend or Notes */}
      {content.metadata?.notes && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> {content.metadata.notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableExerciseRenderer;
