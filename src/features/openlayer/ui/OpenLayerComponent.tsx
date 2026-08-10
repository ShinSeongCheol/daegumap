'use client';

import {Feature, Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import { useEffect, useRef } from "react";
import {XYZ} from "ol/source";
import {defaults} from "ol/control";
import {Point} from "ol/geom";

interface Props {
    center?: [number, number],
    zoom?: number,
    url?: string;
}

export default function OpenLayerComponent({center=[128.6014, 35.8714], zoom=13, url=`${process.env.NEXT_PUBLIC_OPENSTREETMAP_URL}/tile/{z}/{x}/{y}.png`}: Props) {

    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        const fetchCommercials = async (): Promise<void> => {
            const data = await fetch('/api/commercials')
            console.log(await data.json());
        }

        void fetchCommercials();

        const marker = new Feature({
            geometry: new Point(
                fromLonLat(center)
            )
        })

        const vectorSource = new VectorSource({
            features: [marker]
        });
        const markerLayer = new VectorLayer({
            source: vectorSource,
        });

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

        return () => {
            map.setTarget(undefined)
        }

    }, [center, zoom, url])

    return (
        <div ref={mapRef} className="absolute w-full h-full"></div>
    )
}