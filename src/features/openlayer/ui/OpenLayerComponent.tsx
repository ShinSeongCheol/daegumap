'use client';

import {Feature, Map, View} from "ol";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import {fromLonLat, transformExtent} from "ol/proj";
import VectorSource from "ol/source/Vector";
import { useEffect, useRef } from "react";
import {Cluster, XYZ} from "ol/source";
import {defaults} from "ol/control";
import {Point} from "ol/geom";
import {
    city_business_statistic, CommercialArea,
    district_business_statistic,
    legal_dong_business_statistic
} from "@/src/features/business/types";
import {Fill, Icon, Stroke, Style, Text} from "ol/style";

interface Props {
    center?: [number, number],
    zoom?: number,
    url?: string;
}

export default function OpenLayerComponent({center=[128.6014, 35.8714], zoom=13, url=`${process.env.NEXT_PUBLIC_OPENSTREETMAP_URL}/tile/{z}/{x}/{y}.png`}: Props) {

    const mapRef = useRef<HTMLDivElement | null>(null);

    // <Building2 />
    const building2 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></svg>`
    // <Building />
    const building = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-icon lucide-building"><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/><path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>`
    // <House />
    const house = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`
    // <Store />
    const store = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-store-icon lucide-store"
    >
      <!-- 내부 배경 -->
      <path
        d="M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9L17.5 3H6.5L4 9Z"
        fill="currentColor"
        fill-opacity="0.12"
        stroke="none"
      />
    
      <!-- 기존 아이콘 -->
      <path d="M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5"/>
      <path d="M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244"/>
      <path d="M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05"/>
    </svg>
    `;

    useEffect(() => {
        if (!mapRef.current) return;

        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            declutter: true,
        })

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
                vectorLayer,
            ]
        });

        map.on('moveend', async () => {
            const zoom = map.getView().getZoom();
            vectorSource.clear();

            if (!zoom) return;

            if (zoom < 9) { // 도시
                const res = await fetch(`/api/statistics/cities`)
                const cityStatistics: city_business_statistic[] = await res.json();

                const markerFeatures = cityStatistics.map(statistic => {
                    const point = new Point(fromLonLat([statistic.longitude, statistic.latitude]))
                    return new Feature({
                        geometry: point,
                        city_name: statistic.city_name,
                        total_count: statistic.total_count
                    })
                })

                markerFeatures.map(markerFeature => {
                    markerFeature.setStyle(new Style({
                        // image: new Icon({
                        //     anchor: [0.5, 1],
                        //     src: `data:image/svg+xml;utf8,${encodeURIComponent(building2)}`,
                        //     scale: 1
                        // }),

                        text: new Text({
                            text: `${markerFeature.get('city_name')}\n ${markerFeature.get('total_count')}개`,
                            font: 'bold 12px sans-serif',
                            fill: new Fill({ color: '#FFFFFF' }),
                            stroke: new Stroke({
                                width: 4,
                                color: 'black'
                            }),
                            textAlign: 'center',
                            textBaseline: 'middle',
                        }),
                    }))
                })
                vectorSource.addFeatures(markerFeatures);

                return;

            }else if (zoom < 12) { // 시군구
                const res = await fetch(`/api/statistics/districts`)
                const districtStatistics: district_business_statistic[] = await res.json();

                const markerFeatures = districtStatistics.map(statistic => {
                    const point = new Point(fromLonLat([statistic.longitude, statistic.latitude]))
                    return new Feature({
                        geometry: point,
                        district_name: statistic.district_name,
                        total_count: statistic.total_count
                    })
                })

                markerFeatures.map(markerFeature => {
                    markerFeature.setStyle(new Style({
                        text: new Text({
                            text: `${markerFeature.get('district_name')}\n ${markerFeature.get('total_count')}개`,
                            font: 'bold 12px sans-serif',
                            fill: new Fill({ color: '#FFFFFF' }),
                            stroke: new Stroke({
                                width: 4,
                                color: 'black'
                            }),
                            textAlign: 'center',
                            textBaseline: 'middle',
                        }),
                    }))
                })

                vectorSource.addFeatures(markerFeatures);
                return;

            }else if (zoom < 17) { // 법정동
                const res = await fetch(`/api/statistics/legal_dongs`)
                const legalDongStatistics: legal_dong_business_statistic[] = await res.json();

                const markerFeatures = legalDongStatistics.map(statistic => {
                    const point = new Point(fromLonLat([statistic.longitude, statistic.latitude]))
                    return new Feature({
                        geometry: point,
                        legal_dong_name: statistic.legal_dong_name,
                        total_count: statistic.total_count
                    })
                })

                markerFeatures.map(markerFeature => {
                    markerFeature.setStyle(new Style({
                        text: new Text({
                            text: `${markerFeature.get('legal_dong_name')}\n ${markerFeature.get('total_count')}개`,
                            font: 'bold 12px sans-serif',
                            fill: new Fill({ color: '#FFFFFF' }),
                            stroke: new Stroke({
                                width: 4,
                                color: 'black'
                            }),
                            textAlign: 'center',
                            textBaseline: 'middle',
                        }),
                    }))
                })

                vectorSource.addFeatures(markerFeatures);
                return;
            }else {
                // 개별

                const extent = map.getView().calculateExtent(map.getSize());
                const [minLng, minlat, maxLng, maxLat] = transformExtent(extent, 'EPSG:3857', 'EPSG:4326');

                const res = await fetch(`/api/businesses?minLng=${minLng}&minLat=${minlat}&maxLng=${maxLng}&maxLat=${maxLat}`)
                const businessList:CommercialArea[] = await res.json();

                const markerFeatures = businessList.map(business => {
                    const point = new Point(fromLonLat([business.longitude, business.latitude]));
                    return new Feature({
                        geometry: point,
                        business_name: business.business_name,
                        branch_name: business.branch_name
                    })
                })

                markerFeatures.map(markerFeature => {
                    markerFeature.setStyle(new Style({
                        image: new Icon({
                            anchor: [0.5, 1],
                            src: `data:image/svg+xml;utf8,${encodeURIComponent(store)}`,
                            scale: 1
                        }),

                        text: new Text({
                            text: `${markerFeature.get('business_name')}\n ${markerFeature.get('branch_name')}`,
                            font: 'bold 12px sans-serif',
                            fill: new Fill({ color: '#FFFFFF' }),
                            stroke: new Stroke({
                                width: 4,
                                color: 'black'
                            }),
                            textAlign: 'center',
                            textBaseline: 'middle',
                            offsetY: 12
                        }),
                    }))
                })

                vectorSource.addFeatures(markerFeatures);
            }
        })

        return () => {
            map.setTarget(undefined)
        }

    }, [center, zoom, url])

    return (
        <div ref={mapRef} className="absolute w-full h-full"></div>
    )
}