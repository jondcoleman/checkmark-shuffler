import Papa from 'papaparse';

export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false, // We'll handle headers manually for transposition
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const transposeData = (data) => {
    if (!data || data.length === 0) return [];
    
    // data is array of arrays
    // data[0] is original headers (Date, Habit1, Habit2...)
    // data[1...] is rows (DateValue, Habit1Value, Habit2Value...)

    // We want:
    // New Header: [ "Habits", DateValue1, DateValue2... ]
    // New Row 1: [ Habit1, Habit1Value1, Habit1Value2... ]

    const originalHeaders = data[0]; 
    const rows = data.slice(1);

    // Filter out empty rows if any slipped through
    const cleanRows = rows.filter(r => r.length > 0);

    // The first column of original data is "Date". We want these to become the headers (columns 2..N) of the new table
    // But wait, the screenshot shows "Habits" as the first column header.
    // The columns of the new table will be: [ "Habit Name", ...Dates ]
    
    // Extract Dates (first element of each row)
    const dates = cleanRows.map(row => row[0]);
    
    // Extract Habit Names (originalHeaders slice 1)
    const habitNames = originalHeaders.slice(1);

    // Build the new specific structure
    // Header Row
    const transposedHeader = ["Habits", ...dates];

    // Data Rows
    // For each habit, we create a row.
    // Row = [ HabitName, ...values_for_that_habit_across_all_dates ]
    
    const transposedRows = habitNames.map((habitName, habitIndex) => {
        // habitIndex maps to column index in original data (offset by 1 because 0 is Date)
        const originalColIndex = habitIndex + 1;
        
        const values = cleanRows.map(row => row[originalColIndex]);
        return [habitName, ...values];
    });

    return [transposedHeader, ...transposedRows];
};
