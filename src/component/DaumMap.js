/* global kakao */
/* global daum */
import React, { useEffect, useState } from "react";

const { kakao } = window;
const { daum } = window;

const DaumMap = ({onChange, address, isCUPage}) => {

    const [container, setContainer] = useState({})
    const [map, setMap] = useState({})
    const [geocoder, setGeocoder] = useState({})
    const [marker, setMarker] = useState({})

    const str_address = address ? address.address : '';
    const map_display = isCUPage && str_address === '' ? "none" : "block";

    useEffect(() => {
        setContainer(document.getElementById("map"));
    
        let options = {
          center: new kakao.maps.LatLng(address ? address.latitude:37.566826, address ? address.longitude :126.9786567),
          level: 3,
        };
    
        let _map = new kakao.maps.Map(document.getElementById("map"), options)
        setMap(_map);

        let _geocoder = new kakao.maps.services.Geocoder()
        setGeocoder(_geocoder);

        let markerPosition = new kakao.maps.LatLng(
            address ? address.latitude: 37.62197524055062,
            address ? address.longitude: 127.16017523675508
          );

        let _marker = new kakao.maps.Marker({
            position: markerPosition,
            map: _map
        })
        setMarker(_marker)

        if (isCUPage) {
            kakao.maps.event.addListener(_map, 'click', function(mouseEvent) {        
    
                // 클릭한 위도, 경도 정보를 가져옵니다 
                var latlng = mouseEvent.latLng; 
                
                // 마커 위치를 클릭한 위치로 옮깁니다
                searchDetailAddrFromCoords(latlng, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var detailAddr = result[0].address.address_name;
                        document.getElementById("sample5_address").value = detailAddr;
    
                        // 마커를 클릭한 위치에 표시합니다 
                        _marker.setPosition(mouseEvent.latLng);
                        
                        onChange({target: {
                            name: "address"
                            ,value: {
                                address: detailAddr
                                , longitude: latlng.getLng()
                                , latitude: latlng.getLat()
                        }}})
                    }   
                });
            });
    
            function searchDetailAddrFromCoords(coords, callback) {
                // 좌표로 법정동 상세 주소 정보를 요청합니다
                _geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
            }

        }

    }, []);

    const sample5_execDaumPostcode = () => {
        new daum.Postcode({
            oncomplete: function(data) {
                let addr = data.address; // 최종 주소 변수

                // 주소 정보를 해당 필드에 넣는다.
                document.getElementById("sample5_address").value = addr;
                // 주소로 상세 정보를 검색
                geocoder.addressSearch(data.address, function(results, status) {
                    // 정상적으로 검색이 완료됐으면
                    if (status === daum.maps.services.Status.OK) {

                        let result = results[0]; //첫번째 결과의 값을 활용

                        // 해당 주소에 대한 좌표를 받아서
                        let coords = new daum.maps.LatLng(result.y, result.x);
                        // 지도를 보여준다.
                        container.style.display = "block";
                        map.relayout();
                        // 지도 중심을 변경한다.
                        map.setCenter(coords);
                        // 마커를 결과값으로 받은 위치로 옮긴다.
                        marker.setPosition(coords)

                        onChange({target: {
                            name: "address"
                            ,value: {
                                address: addr
                                , longitude: result.x
                                , latitude: result.y
                            }}})
                    }
                });
            }
        }).open();

    }

    return (
        <div>
            <input 
                type="text" 
                id="sample5_address"  
                placeholder="주소" 
                hidden={!isCUPage}
                defaultValue={str_address}
                disabled
            />
            <input 
                type="button" 
                onClick={sample5_execDaumPostcode} 
                value="주소 검색" 
                hidden={!isCUPage}
            />
            <br />
            <div 
                id="map" 
                style={{
                    width:"300px"
                    , height:"300px"
                    // , display: map_display
                }}
            ></div>
        </div>
    )
}

export default DaumMap;