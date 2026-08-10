'use server'

import { CommercialArea } from '@/src/types';
import { createClient } from '@/src/utils/supabase/server';
import { cookies } from 'next/headers';

interface Props {
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number
}

export async function loadCommercialArea({minLng, minLat, maxLng, maxLat}:Props) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore);  

    const {data, error} = await supabase.from('commercial_area')
        .select<string, CommercialArea>('*')
        .gte('longitude', minLng)
        .lte('longitude', maxLng)
        .gte('latitude', minLat)
        .lte('latitude', maxLat)

    return data
}

export async function loadLegalDong() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {data, error} = await supabase.from('commercial_area_legal_dong_view').select('*');

    return data
}

export async function loadCity() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {data, error} = await supabase.from('commercial_area_city_view').select('*');

    return data;
}