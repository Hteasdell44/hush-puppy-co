import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/BreedIdentifier.css";
import Chart from 'chart.js/auto'; // Import Chart.js

const BreedIdentifier = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [breed, setBreed] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [productRecommendation, setProductRecommendation] = useState('');
  const [productRecommendationPrice, setProductRecommendationPrice] = useState(0);
  const [correctRecommendation, setCorrectRecommendation] = useState(false);
  const [showCorrectionQuestion, setShowCorrectionQuestion] = useState(false);
  const [showCorrectionList, setShowCorrectionList] = useState(false);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [allBreeds, setAllBreeds] = useState([]);
  const [showDatasetSummary, setShowDatasetSummary] = useState(false);
  const [imageSizes, setImageSizes] = useState([]);
  const [imageCounts, setImageCounts] = useState([]);
  const [dogBreeds, setDogBreeds] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading state to true
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Preprocess image before sending to the backend
      const preprocessedImage = await preprocessImage(selectedFile);
      formData.append('preprocessedImage', preprocessedImage);

      const response = await axios.post('/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBreed(response.data.breed);
      setConfidence(response.data.confidence);
      setRecommendation(response.data.recommendation);
      setProductRecommendation(response.data.recommendedProduct);
      setProductRecommendationPrice(response.data.recommendedProductPrice)
      setAllBreeds(response.data.dogBreeds)
      setShowCorrectionQuestion(true);
    } catch (error) {
      console.error('Error predicting breed:', error);
    } finally {
      setLoading(false); // Set loading state to false after request completion
    }
  };

  const handleYes = () => {
    setCorrectRecommendation(true)
    setShowCorrectionQuestion(false)
  };

  const handleNo = () => {
    setShowCorrectionList(true);
    setShowCorrectionQuestion(false);
  };

  const handleCorrection = async () => {

    console.log('entering!')
    try {
      setLoading(true);
      const response = await axios.post('/api/correct-breed', { breed: selectedBreed });
      setBreed(response.data.correctedBreed);
      console.log(response.data)
      setRecommendation(response.data.correctedRecommendation.recommendation);
      setProductRecommendation(response.data.correctedRecommendation.productRecommendation);
      setProductRecommendationPrice(response.data.correctedRecommendation.productRecommendationPrice);
      setCorrectRecommendation(true);
      setShowCorrectionList(false);
    } catch (error) {
      console.error('Error correcting breed:', error);
    } finally {
      setLoading(false);
    }
  };

    // Preprocess the image before sending to the backend
    const preprocessImage = async (file) => {
      // Resize the image to fit MobileNet's input size (224x224)
      const image = await resizeImage(file, 224, 224);
  
      // Convert the image to base64 format
      const reader = new FileReader();
      reader.readAsDataURL(image);
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    };
  
    // Resize the image to the specified dimensions
    const resizeImage = (file, width, height) => {
      return new Promise((resolve) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg');
        };
      });
    };

    const plotHistogram = (data) => {
        const ctx = document.getElementById('imageSizesHistogram');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.map((size, index) => `Image ${index + 1}`),
            datasets: [{
              label: 'Image Sizes',
              data: data,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                title: {
                  display: true,
                  text: 'Image Size (bytes)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Image Number'
                }
              }
            }
          }
        });
      };

        const plotBarChart = (imageCounts) => {
            const labels = imageCounts.map(data => data.breed);
            const data = imageCounts.map(data => data.count);
        
            const ctx = document.getElementById('image-count-chart');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Images',
                        data: data,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // Change axis to y-axis for better visualization
                    scales: {
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Dog Breeds'
                            }
                        },
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Images'
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Number of Images: ${context.raw}`;
                                }
                            }
                        }
                    }
                }
            });
        };

        const plotPieChart = (breedsData) => {
            const breedLabels = breedsData.map(breedData => breedData.breed);
            const breedCountsData = breedsData.map(breedData => breedData.count);
        
            const ctx = document.getElementById('breedPieChart');
            new Chart(ctx, {
              type: 'pie',
              data: {
                labels: breedLabels,
                datasets: [{
                  label: 'Dog Breeds',
                  data: breedCountsData,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    // Add more colors as needed
                  ],
                  hoverOffset: 4
                }]
              }
            });
        };

    useEffect(() => {
      // Fetch image sizes from the server
        axios.get('/api/image-sizes')
            .then(response => {
            
            setImageSizes(response.data.imageSizes);
            plotHistogram(imageSizes);
            })
            .catch(error => {
            console.error('Error fetching image sizes:', error);
        });

        axios.get('/api/image-count-per-breed')
            .then(response => {
                setImageCounts(response.data.imageCounts);
                plotBarChart(response.data.imageCounts);
            })
            .catch(error => {
                console.error('Error fetching image counts per breed:', error);
        });

        axios.get('/api/dog-breeds')
            .then(response => {
                setDogBreeds(response.data.dogBreeds);
                plotPieChart(response.data.dogBreeds);
            })
            .catch(error => {
                console.error('Error fetching dog breeds:', error);
        });

    }, []); 
  

  return (
    <div id="breed-identifier-container">

      <h2>Breed Identifier</h2>

      <div id='upload-box'>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Predict</button>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && breed && (

        <div>
          <h2>Predicted Breed: {breed}</h2>
          <p>Confidence: {confidence}</p>
        </div>

      )}

        {showCorrectionQuestion && (

            <>
              <button onClick={handleYes}>Yes</button>
              <button onClick={handleNo}>No</button>
            </>

        )}


        {correctRecommendation && (

            <>
                <p>Recommendation: {recommendation}</p>
                <h3>We Recommend The:</h3>
                <p>{productRecommendation}</p>
                <p>{productRecommendationPrice}</p>
            </>

        )}

        {showCorrectionList && (
            <>
                <select onChange={(e) => setSelectedBreed(e.target.value)}>
                    <option value="">Select Correct Breed</option>
                    {allBreeds.map((breedOption, index) => (
                        <option key={index} value={breedOption}>{breedOption}</option>
                    ))}
                    <option>Not Listed</option>
                </select>
                <button onClick={handleCorrection}>Correct Breed</button>
            </>
        )}

        {!showCorrectionQuestion && !showCorrectionList && (<button onClick={() => setShowDatasetSummary(!showDatasetSummary)}>Explore Dataset</button>)}

        {showDatasetSummary && (
            <div>
                <div>
                    <h3>Dataset Summary</h3>
                    <p>Total records: 20,580</p>
                    <p>Unique breeds: 103</p>
                </div>

                <div>
                    <h3>Distribution of Image Sizes</h3>
                    {/* <canvas id="imageSizesHistogram"></canvas> */}
                </div>

                <div>
                    <h3>Image Count By Breed</h3>
                    <canvas id="image-count-chart"></canvas>
                </div>

                <div>
                    <h3>Dog Breed Distribution</h3>
                    {/* <canvas id="breedPieChart"></canvas> */}
                </div>

            </div>
        )}

        </div>

)};

export default BreedIdentifier;
