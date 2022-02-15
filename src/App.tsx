import * as React from 'react';
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import styled from 'styled-components';
import { Icon } from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { Car } from './interfaces/interfaces';

const Wrapper = styled.div`
  display: flex;
`;
const MapWrapper = styled.div`
  width: 50vw;
  height: 100vh;
`;
const InfoWrapper = styled.div`
  height: 100vh;
  width: 50vw;
  border: 1px solid black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledMapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
`;
const CarDetailsWrapper = styled.div`
  padding: 1.5rem;
  height: 50vh;
  border-radius: 15px 15px 0 0;
  border: 1px solid black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  & > * {
    margin: 0.5rem;
  }
`;
const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem;
`;
const Filter = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
`;
const OptionsWrapper = styled.div`
  display: flex;
  align-self: center;
  margin-top: 10px;
`;
const Title = styled.h2`
  align-self: center;
`;

const carFreeIcon = new Icon({
  iconUrl: require('assets/images/car-free.png'),
  iconSize: [33, 15],
});
const carBusyIcon = new Icon({
  iconUrl: require('assets/images/car-busy.png'),
  iconSize: [33, 15],
});

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [carDetails, setCarDetails] = useState<Car>();
  const [filtersOptions, setFiltersOptions] = useState({
    status: '',
    batteryLevel: '',
    range: '',
    color: '',
  });

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const cars: Car[] = [];
    try {
      const response = await fetch('/cars', { method: 'GET' }).then((data) => data.json());
      response.data.objects.forEach((item: any) => {
        cars.push({
          latitude: item.location.latitude,
          longitude: item.location.longitude,
          name: item.name,
          batteryLevel: item.batteryLevelPct,
          color: item.color,
          status: item.status,
          range: item.rangeKm,
          sideNumber: item.sideNumber,
          platesNumber: item.platesNumber,
        });
      });
      setCars(cars);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Wrapper>
      <MapWrapper>
        <StyledMapContainer center={[52.193891367697, 20.950564789789]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MarkerClusterGroup>
            {cars.length > 0
              ? cars
                  .filter((car) => (filtersOptions.status === '' ? car : car.status === filtersOptions.status))
                  .filter((car) => (filtersOptions.color === '' ? car : car.color === filtersOptions.color))
                  .filter((car) => (filtersOptions.batteryLevel === '' ? car : car.batteryLevel >= Number(filtersOptions.batteryLevel)))
                  .filter((car) => (filtersOptions.range === '' ? car : car.range >= Number(filtersOptions.range)))
                  .map((car, index) => {
                    return (
                      <Marker
                        key={index}
                        icon={car.status === 'available' ? carFreeIcon : carBusyIcon}
                        position={[car.latitude, car.longitude]}
                        eventHandlers={{
                          click: () => {
                            setCarDetails(car);
                          },
                        }}
                      >
                        <Popup>
                          <p>status: {car.status}</p>
                          <p>name: {car.name}</p>
                          <p>battery level: {car.batteryLevel}%</p>
                        </Popup>
                      </Marker>
                    );
                  })
              : null}
          </MarkerClusterGroup>
        </StyledMapContainer>
      </MapWrapper>
      <InfoWrapper>
        <FiltersWrapper>
          <Title>Filters</Title>
          <OptionsWrapper>
            <Filter>
              <label>status:</label>
              <select onChange={(e) => setFiltersOptions({ ...filtersOptions, status: e.target.value })}>
                <option value="">choose option</option>
                <option value="available">available</option>
                <option value="busy">busy</option>
              </select>
            </Filter>
            <Filter>
              <label>battery level:</label>
              <select onChange={(e) => setFiltersOptions({ ...filtersOptions, batteryLevel: e.target.value })}>
                <option value="">choose option</option>
                <option value="50">more than 50%</option>
              </select>
            </Filter>
            <Filter>
              <label>range:</label>
              <select onChange={(e) => setFiltersOptions({ ...filtersOptions, range: e.target.value })}>
                <option value="">choose option</option>
                <option value="50">more than 50km</option>
                <option value="100">more than 100km</option>
                <option value="150">more than 150km</option>
              </select>
            </Filter>
            <Filter>
              <label>color:</label>
              <select onChange={(e) => setFiltersOptions({ ...filtersOptions, color: e.target.value })}>
                <option value="">choose option</option>
                <option value="White">white</option>
                <option value="black">black</option>
                <option value="Red">red</option>
                <option value="Blue">blue</option>
              </select>
            </Filter>
          </OptionsWrapper>
        </FiltersWrapper>
        {carDetails ? (
          <CarDetailsWrapper>
            <p>Status: {carDetails.status}</p>
            <p>Name: {carDetails.name}</p>
            <p>Color: {carDetails.color}</p>
            <p>Battery level: {carDetails.batteryLevel}%</p>
            <p>Range: {carDetails.range}km</p>
            <p>Side number: {carDetails.sideNumber}</p>
            <p>Plates number: {carDetails.platesNumber}</p>
          </CarDetailsWrapper>
        ) : null}
      </InfoWrapper>
    </Wrapper>
  );
}

export default App;
