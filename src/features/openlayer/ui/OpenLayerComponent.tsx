'use client';

import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { useEffect, useRef } from "react";
import {XYZ} from "ol/source";
import {defaults} from "ol/control";

interface Props {
    center?: [number, number],
    zoom?: number,
    url?: string;
}

const markerSvg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="48"
         height="56"
         viewBox="0 0 48 56">
      <path
        d="M24 2C14.1 2 6 10.1 6 20c0 12 18 34 18 34s18-22 18-34C42 10.1 33.9 2 24 2z"
        fill="#4F46E5"
      />
      <circle cx="24" cy="20" r="10" fill="white" />
      <circle cx="24" cy="20" r="5" fill="#4F46E5" />
    </svg>
`.trim();

const markerImageUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`;

const markerStyle = new Style({
    image: new Icon({
        src: markerImageUrl,

        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',

        scale: 0.7
    })
});

export default function OpenLayerComponent({center=[128.6014, 35.8714], zoom=13, url=`${process.env.NEXT_PUBLIC_OPENSTREETMAP_URL}/tile/{z}/{x}/{y}.png`}: Props) {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const vectorSourceRef = useRef<VectorSource | null>(null)

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();
        const markerLayer = new VectorLayer({
            source: vectorSource,
            style: markerStyle,
        });

        vectorSourceRef.current = vectorSource;

        const map = new Map({
            target: mapRef.current,
            view: new View({
                center: fromLonLat(center),
                zoom: 13
            }),
            controls: defaults({
                zoom: false,
                rotate: false,
            }),
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: url
                    })
                }),
                markerLayer,
            ]
        });

    }, [center, zoom, url])

    return (
        <div ref={mapRef} className="absolute w-full h-full"></div>
    )
}