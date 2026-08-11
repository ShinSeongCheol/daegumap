-- This is an empty migration.
CREATE MATERIALIZED VIEW city_business_stats AS
SELECT
    commercial_area.city_code,
    commercial_area.city_name,
    count('*') AS total_count,
    avg(commercial_area.longitude) AS longitude,
    avg(commercial_area.latitude) AS latitude
from commercial_area
group by city_code, city_name;

CREATE MATERIALIZED VIEW district_business_stats AS
SELECT
    commercial_area.city_code,
    commercial_area.city_name,
    commercial_area.district_code,
    commercial_area.district_name,
    count('*') AS total_count,
    AVG(commercial_area.longitude) AS longitude,
    AVG(commercial_area.latitude) AS latitude
FROM commercial_area
GROUP BY city_code, city_name, district_code, district_name;

CREATE MATERIALIZED VIEW legal_dong_business_stats AS
SELECT
    commercial_area.city_code,
    commercial_area.city_name,
    commercial_area.district_code,
    commercial_area.district_name,
    commercial_area.legal_dong_code,
    commercial_area.legal_dong_name,
    count('*') AS total_count,
    AVG(commercial_area.longitude) AS longitude,
    AVG(commercial_area.latitude) AS latitude
FROM commercial_area
GROUP BY city_code, city_name, district_code, district_name, legal_dong_code, legal_dong_name;