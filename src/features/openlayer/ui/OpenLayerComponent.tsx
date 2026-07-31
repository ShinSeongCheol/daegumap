'use client';

import { CommercialArea } from "@/src/types";
import { Feature, Map, Overlay, View } from "ol";
import { Point } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat, transformExtent } from "ol/proj";
import { Cluster, XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useRef } from "react";
import { loadCommercialArea } from "../actions";

interface Props {
    center?: [number, number],
    zoom?: number,
    url?: string;
}

export default function OpenLayerComponent({center=[128.6014, 35.8714], zoom=13, url='http://localhost:8080/tile/{z}/{x}/{y}.png'}: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map|null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="56"
            viewBox="0 0 48 56"
            fill="none">

        <!-- 핀 -->
        <path
            d="M24 2C14.1 2 6 10.1 6 20c0 12 18 34 18 34s18-22 18-34C42 10.1 33.9 2 24 2z"
            fill="#4F46E5"/>

        <!-- 흰 원 -->
        <circle
            cx="24"
            cy="20"
            r="11"
            fill="white"/>

        <!-- Store -->
        <g
            transform="translate(16 12) scale(.66)"
            stroke="#4F46E5"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">

            <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/>
            <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/>
            <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>

        </g>
        </svg>
    `.trim();

    const iconSvg = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

    const markerStyle = new Style({
        image: new Icon({
            anchor: [0.5, 0.5],
            src: iconSvg,
            scale: 0.6
        }),
    });

    useEffect(() => {
        if (!mapRef.current) return;
        if (!tooltipRef.current) return;

        const vectorSource = new VectorSource({
        })

        const clusterSource = new Cluster({
            distance: 40, 
            source: vectorSource,
        });

        const vectorLayer = new VectorLayer({
            source: clusterSource,
            style: markerStyle
        })

        const tooltipOvelay = new Overlay({
            element: tooltipRef.current,
            offset: [0, -15],
            positioning: 'bottom-center',
            stopEvent: false
        })

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: url,
                        maxZoom: 19
                    })
                }),
                vectorLayer
            ],
            overlays: [tooltipOvelay],
            view: new View({
                center: fromLonLat(center),
                zoom: zoom
            }),
        })

        const fetchMarker = async () => {
            const extent = map.getView().calculateExtent(map.getSize());
            const [minLng, minLat, maxLng, maxLat] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');
            const commercialAreaList = await loadCommercialArea({minLng: minLng, minLat: minLat, maxLng: maxLng, maxLat: maxLat});

            const markerFeatureList = commercialAreaList?.map((data) => {
                const coordinate = [data.longitude, data.latitude];
                const feature = new Feature({
                    geometry: new Point(fromLonLat(coordinate)),
                    name: data.business_name
                })

                feature.setStyle(markerStyle);
                return feature;
            });

            if (!markerFeatureList) return;

            vectorSource.clear()
            vectorSource.addFeatures(markerFeatureList);
        }

        fetchMarker();

        map.on('moveend', fetchMarker);
        map.on('pointermove', (evt) => {
            const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

            if (feature) {

                let storeInfo = '';

                const storeFeatureList = feature.get('features') as Feature[];
                for (let storeFeature of storeFeatureList) {
                    let storedName = storeFeature.get('name')
                    storeInfo += storedName + '<br/>';
                }

                // 툴팁 텍스트 변경
                if (tooltipRef.current) {
                    tooltipRef.current.innerHTML = storeInfo;
                }

                // 툴팁 위치를 마커의 좌표로 이동 및 표시
                const geometry = feature.getGeometry();
                if (geometry instanceof Point) {
                    tooltipOvelay.setPosition(geometry.getCoordinates() as number[]);
                }

                map.getTargetElement().style.cursor = 'pointer';
            } else {
                tooltipOvelay.setPosition(undefined);
                map.getTargetElement().style.cursor = '';
            }
        })

        mapInstance.current = map;
        
        return () => {
            map.setTarget(undefined);
            mapInstance.current = null;
        }

    }, [center, zoom, url])


    return (
        <div>
            <div ref={mapRef} className="w-screen h-screen"></div>
            <div
                ref={tooltipRef}
                className="pointer-events-none absolute hidden rounded-md bg-gray-900/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
                style={{
                    display: 'block',
                    whiteSpace: 'nowrap',
                }}
            >
            </div>
        </div>
    )
}