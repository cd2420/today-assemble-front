/* global kakao */
/* global daum */
import React, { useEffect, useState } from "react";

const { kakao } = window;
const { daum } = window;

const DaumMap = () => {

    const [container, setContainer] = useState({})
    const [map, setMap] = useState({})
    const [geocoder, setGeocoder] = useState({})
    const [marker, setMarker] = useState({})

    useEffect(() => {
        setContainer(document.getElementById("map"));
    
        let options = {
          center: new kakao.maps.LatLng(35.85133, 127.734086),
          level: 3,
        };
    
        let _map = new kakao.maps.Map(document.getElementById("map"), options)
        setMap(_map);
        setGeocoder(new kakao.maps.services.Geocoder());

        let markerPosition = new kakao.maps.LatLng(
            37.62197524055062,
            127.16017523675508
          );
        setMarker(new kakao.maps.Marker({
            position: markerPosition,
            map: _map
        }))
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
                    }
                });
            }
        }).open();

    }

    return (
        <div>
            <input type="text" id="sample5_address" placeholder="주소" />
            <input type="button" onClick={sample5_execDaumPostcode} value="주소 검색" /><br />
            <div id="map" 
                style={{width:"300px", height:"300px", display:"none"}}
            ></div>
        </div>
    )
}

export default DaumMap;