import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/BreedIdentifier.css";

const BreedIdentifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breed, setBreed] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [allBreeds, setAllBreeds] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBreed(response.data.breed);
      setConfidence(response.data.confidence);
      setRecommendation(response.data.recommendation);
      setAllBreeds(response.data.breeds)
      setShowCorrection(true);
    } catch (error) {
      console.error('Error predicting breed:', error);
    } finally {
      setLoading(false); // Set loading state to false after request completion
    }
  };

  const handleYes = () => {
    setShowCorrection(false);
  };

  const handleNo = () => {
    setShowCorrection(true);
  };

  const handleCorrection = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/correct-breed', { breed: selectedBreed });

      setBreed(response.data.correctedBreed);
      setRecommendation(response.data.recommendation);
      setShowCorrection(false);
    } catch (error) {
      console.error('Error correcting breed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="breed-identifier-container">
      <h2>Breed Identifier</h2>
      <div id='upload-box'>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Predict</button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && (
        <>
          {breed && (
            <div>
              <h2>Predicted Breed: {breed}</h2>
              <p>Confidence: {confidence}</p>
              {showCorrection ? (
                <>
                  <button onClick={handleYes}>Yes</button>
                  <button onClick={handleNo}>No</button>
                  {selectedBreed === '' && (
                    <select onChange={(e) => setSelectedBreed(e.target.value)}>
                      <option value="">Select Correct Breed</option>
                      {allBreeds.map((breed, index) => (
                        <option key={index} value={breed}>{breed}</option>
                      ))}
                    </select>
                  )}
                  <button onClick={handleCorrection}>Correct Breed</button>
                </>
              ) : (
                <p>Recommendation: {recommendation}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BreedIdentifier;
