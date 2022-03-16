/* global kakao */
/* global daum */
import React, { useEffect, useState } from "react";

const { kakao } = window;
const { daum } = window;

const DaumMap = ({onChange, address}) => {

    const isDetailPage = address ? "block" : "none";
    const isMakePage = !address ? "inline" : "none";

    const [container, setContainer] = useState({})
    const [map, setMap] = useState({})
    const [geocoder, setGeocoder] = useState({})
    const [marker, setMarker] = useState({})
    

    useEffect(() => {
        setContainer(document.getElementById("map"));
    
        let options = {
          center: new kakao.maps.LatLng(address ? address.latitude:37.566826, address ? address.longitude :126.9786567),
          level: 3,
        };
    
        let _map = new kakao.maps.Map(document.getElementById("map"), options)
        setMap(_map);
        setGeocoder(new kakao.maps.services.Geocoder());

        let markerPosition = new kakao.maps.LatLng(
            address ? address.latitude: 37.62197524055062,
            address ? address.longitude: 127.16017523675508
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
            <input type="text" id="sample5_address"  placeholder="주소" value={address ? address.address : ''} disabled={address ? true : false}/>
            <input 
                type="button" 
                onClick={sample5_execDaumPostcode} 
                value="주소 검색" 
                style={{display: isMakePage }}
            />
            <br />
            <div 
                id="map" 
                style={{width:"300px", height:"300px", display: isDetailPage }}
            ></div>
        </div>
    )
}

export default DaumMap;