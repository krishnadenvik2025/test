const getDate = (date) => {
    var d = new Date(0);
    d.setUTCSeconds(date);
    return d.toLocaleString();
}
const getCurTime = () => {
    var d = new Date();
    return d.toLocaleString();
}
module.exports = {
    insertDataToDataLog: (
        device_id, msgData) => {
    const wifiStrengthMap = {
        low: 0,
        medium: 1,
        good: 2
    };
    const wifiStrength = msgData.wifi_strength
        ? wifiStrengthMap[msgData.wifi_strength.toLowerCase()] ?? null
        : null;

    return `INSERT INTO master_catalog.devicecurrentsetting_log ("deviceId", ec, ph, waterr_temp,
        light_on_off_layers, light_intensity, ambient_temperature, ambient_humidity, water_flow_rate,
        supp_ph_inc_lev, supp_ph_dec_lev, supp_ec_a_lev, supp_ec_b_lev, "hasAlarm", created_timestamp,
        water_level_indicator, irrigation_pump, chiller_pump, wifi_strength, actual_water_level, indoor_aqi_index,
        indoor_pm25_ug_m3, indoor_pm10_ug_m3, indoor_tvoc_ppb, indoor_co2_ppm, indoor_temperature_celsius,
        indoor_humidity_rh_percent, indoor_nox_index, outdoor_aqi_index, outdoor_pm25_ug_m3, outdoor_pm10_ug_m3, 
        outdoor_tvoc_ppb, outdoor_co2_ppm, outdoor_temperature_celsius,outdoor_humidity_rh_percent, outdoor_nox_index,
        modified_timestamp)
        VALUES (
            '${device_id}',
            ${msgData.water_ec ?? 'NULL'},
            ${msgData.water_pH ?? 'NULL'},
            ${msgData.water_temperature ?? 'NULL'},
            '${msgData.light_stat ?? 'NULL'}',
            ${msgData.light_brightness ?? 'NULL'},
            ${msgData.ambient_temp ?? 'NULL'},
            ${msgData.ambient_humid ?? 'NULL'},
            ${msgData.water_flow ?? 'NULL'},
            ${msgData.supp_ph_inc ?? 'NULL'},
            ${msgData.supp_ph_dec ?? 'NULL'},
            ${msgData.supp_ec_a ?? 'NULL'},
            ${msgData.supp_ec_b ?? 'NULL'},
            ${msgData.error ?? 'NULL'},
            '${getDate(msgData.timestamp ?? new Date())}',
            ${msgData.water_level ?? 'NULL'},
            ${Boolean(Number(msgData.irrigation_state ?? 0))},
            ${Boolean(Number(msgData.chiller_state ?? 0))},
            ${wifiStrength ?? 'NULL'},
            ${msgData.ultrasonic ?? 'NULL'},
            ${msgData.indoor_aqi_index ?? 'NULL'},
            ${msgData.indoor_pm25_ug_m3 ?? 'NULL'},
            ${msgData.indoor_pm10_ug_m3 ?? 'NULL'},
            ${msgData.indoor_tvoc_ppb ?? 'NULL'},
            ${msgData.indoor_co2_ppm ?? 'NULL'},
            ${msgData.indoor_temperature_celsius ?? 'NULL'},
            ${msgData.indoor_humidity_rh_percent ?? 'NULL'},
            ${msgData.indoor_nox_index ?? 'NULL'},
            ${msgData.outdoor_aqi_index ?? 'NULL'},
            ${msgData.outdoor_pm25_ug_m3 ?? 'NULL'},
            ${msgData.outdoor_pm10_ug_m3 ?? 'NULL'},
            ${msgData.outdoor_tvoc_ppb ?? 'NULL'},
            ${msgData.outdoor_co2_ppm ?? 'NULL'},
            ${msgData.outdoor_temperature_celsius ?? 'NULL'},
            ${msgData.outdoor_humidity_rh_percent ?? 'NULL'},
            ${msgData.outdoor_nox_index ?? 'NULL'},
            NOW()
        )`;
},

    updateDataToRecentData: (
        device_id, msgData) => {
    const wifiStrengthMap = {
        low: 0,
        medium: 1,
        good: 2
    };
    const wifiStrength = msgData.wifi_strength
        ? wifiStrengthMap[msgData.wifi_strength.toLowerCase()] ?? null
        : null;

        let q = `UPDATE master_catalog.devicecurrentsetting
        SET ec=${msgData.water_ec}, ph=${msgData.water_pH}, waterr_temp=${msgData.water_temperature},
        light_on_off_layers='${msgData.light_stat}', light_Intensity=${msgData.light_brightness}, ambient_temperature=${msgData.ambient_temp},
        ambient_humidity=${msgData.ambient_humid}, water_flow_rate=${msgData.water_flow}, supp_ph_inc_lev=${msgData.supp_ph_inc},
        supp_ph_dec_lev=${msgData.supp_ph_dec}, supp_ec_a_lev=${msgData.supp_ec_a}, supp_ec_b_lev=${msgData.supp_ec_b}, "hasAlarm"=${msgData.error},
        created_timestamp='${getDate(msgData.timestamp)}', irrigation_pump=${Boolean(Number(msgData.irrigation_state ?? 0))},
        chiller_pump=${Boolean(Number(msgData.chiller_state ?? 0))}, actual_water_level=${msgData.ultrasonic ?? 'NULL'},
        wifi_strength=${wifiStrength ?? 'NULL'}, water_level_indicator=${msgData.water_level},
        ec_ph_dose = ${msgData.ec_dose_time ?? 'NULL'},
        modified_timestamp = NOW(),

        esg_water_consumption_liters = ${msgData.water_consumption ?? 'NULL'},
        esg_power_consumption_kw = ${msgData.energy_meter ?? 'NULL'},

        indoor_aqi_index = ${msgData.iaq?.aqi ?? 'NULL'},
        indoor_pm25_ug_m3 = ${msgData.iaq?.pm2p5 ?? 'NULL'},
        indoor_tvoc_ppb = ${msgData.iaq?.voc ?? 'NULL'},
        indoor_co2_ppm = ${msgData.iaq?.co2 ?? 'NULL'},
        indoor_temperature_celsius = ${msgData.iaq?.temp ?? 'NULL'},
        indoor_humidity_rh_percent = ${msgData.iaq?.hum ?? 'NULL'},

        outdoor_aqi_index = ${msgData.oaq?.aqi ?? 'NULL'},
        outdoor_pm25_ug_m3 = ${msgData.oaq?.pm2p5 ?? 'NULL'},
        outdoor_tvoc_ppb = ${msgData.oaq?.voc ?? 'NULL'},
        outdoor_co2_ppm = ${msgData.oaq?.co2 ?? 'NULL'},
        outdoor_temperature_celsius = ${msgData.oaq?.temp ?? 'NULL'},
        outdoor_humidity_rh_percent = ${msgData.oaq?.hum ?? 'NULL'}`
        if (Number(msgData.irrigation_state)) {
            q += "water_air_pump_on_duration=1, water_air_pump_off_duration=NULL";
        } else {
            q += "water_air_pump_on_duration=NULL, water_air_pump_off_duration=1";
        }
        q += `  WHERE "deviceId"='${device_id}'`;
        return q;
        //  INSERT INTO master_catalog.devicecurrentsetting ("deviceId", ec, ph, waterr_temp, light_on_off_layers, light_Intensity, ambient_temperature, ambient_humidity, water_flow_rate, supp_ph_inc_lev, supp_ph_dec_lev, supp_ec_a_lev, supp_ec_b_lev, "hasAlarm", created_timestamp) SELECT '${device_id}', ${msgData.water_ec}, ${msgData.water_pH}, ${msgData.water_temperature}, '${msgData.light_stat}', ${msgData.light_brightness}, ${msgData.ambient_temp}, ${msgData.ambient_humid}, ${msgData.water_flow}, ${msgData.supp_ph_inc}, ${msgData.supp_ph_dec}, ${msgData.supp_ec_a}, ${msgData.supp_ec_b}, ${msgData.error}, '${d.toLocaleString()}' WHERE NOT EXISTS( SELECT 1 WHERE 'deviceId'='${device_id}')`;
    },
    insertToAlarmLog: (device_id, msgData) => {
    return `INSERT INTO master_catalog.devicealarm_log
        (water_pump, water_chiller, water_temperature_sensor, ambient_sensor, ph_sensor, ec_sensor,
        supp_ec_pump, supp_ph_inc_pump, supp_ph_dec_pump, deviceid, created_timestamp, transpiration_error,
        water_flow_sensor, ultrasonic_error, auto_topup_error, supp_ph_inc, supp_ph_dec, supp_ec_a, supp_ec_b,
        energy_meter_error, iaq_error, oaq_error)
        VALUES(
            ${msgData.water_pump ?? 'NULL'},
            ${msgData.water_chiller ?? 'NULL'},
            ${msgData.water_temperature_sensor ?? 'NULL'},
            ${msgData.ambient_sensor ?? 'NULL'},
            ${msgData.ph_sensor ?? 'NULL'},
            ${msgData.ec_sensor ?? 'NULL'},
            ${msgData.supp_ec_pump ?? 'NULL'},
            ${msgData.supp_ph_inc_pump ?? 'NULL'},
            ${msgData.supp_ph_dec_pump ?? 'NULL'},
            '${device_id}',
            '${getDate(msgData.timestamp)}',
            ${msgData.transpiration_error ?? 'NULL'},
            ${msgData.water_flow_sensor ?? 'NULL'},
            ${msgData.ultrasonic_error ?? 'NULL'},
            ${msgData.auto_topup_error ?? 'NULL'},
            ${msgData.supp_ph_inc ?? 'NULL'},
            ${msgData.supp_ph_dec ?? 'NULL'},
            ${msgData.supp_ec_a ?? 'NULL'},
            ${msgData.supp_ec_b ?? 'NULL'},
            ${msgData.energy_meter_error ?? 'NULL'},
            ${msgData.iaq_error ?? 'NULL'},
            ${msgData.oaq_error ?? 'NULL'}
        )`;
},

    insertToNotificationLog: (device_id, msgData) => {
        return `INSERT INTO master_catalog.devicenotification_log
            (deviceid, "type", priority, message, created_timestamp, isopen, peripheral)
            VALUES('${device_id}', '${msgData.type}', ${msgData.priority}, '${msgData.message}', '${getDate(msgData.timestamp)}', 1, '${msgData.peripheral}')`
    },
    insertToEventLog: (device_id, type, msgData) => {
        return `INSERT INTO master_catalog.deviceevent_log ("deviceId", type, event, value, created_timestamp)
        VALUES (${device_id}, ${type}, ${msgData.event}, ${msgData.value}, ${msgData.timestamp})`
    },
    updateDeviceAdhocStatus: () => {
    },
    updateDeviceProgram: (device_id, settings) => {
        var t = getCurTime();
        return `INSERT INTO master_catalog.deviceprogram_log (ph_phmin, ph_phmax, ph_phideal, ec_ecmin, ec_ecideal,
            water_tempmax, water_tempideal, supp_pump_ec, supp_pump_phinc, supp_pump_cycle, deviceid, created_timestamp)
            VALUES(${parseFloat(settings.ph_thresholds.phideal) - 0.5}, ${parseFloat(settings.ph_thresholds.phideal) + 0.5}, ${parseFloat(settings.ph_thresholds.phideal)},
            ${parseFloat(settings.ec_thresholds.ecideal) - 100}, ${parseFloat(settings.ec_thresholds.ecideal)}, ${parseFloat(settings.water_temperature.tempideal) + 3},
            ${parseFloat(settings.water_temperature.tempideal)}, ${5}, ${5},
            ${parseFloat(settings.supplement_pump.cycle)}, '${device_id}, '${t});
            UPDATE master_catalog.deviceprogram
            SET ph_phmin=${parseFloat(settings.ph_thresholds.phideal) - 0.5}, ph_phmax=${parseFloat(settings.ph_thresholds.phideal) + 0.5}, ph_phideal=${parseFloat(settings.ph_thresholds.phideal)},
            ec_ecmin=${parseFloat(settings.ec_thresholds.ecideal) - 100}, ec_ecideal=${parseFloat(settings.ec_thresholds.ecideal)}, water_tempmax=${parseFloat(settings.water_temperature.tempideal) + 3},
                water_tempideal=${parseFloat(settings.water_temperature.tempideal)}, supp_pump_ec=${5}, supp_pump_phinc=${5},
            supp_pump_cycle=${parseFloat(settings.supplement_pump.cycle)}, created_timestamp='${t}'
            WHERE deviceid='${device_id}' ;`
    },
    getNotification: (device_id) => {
        return `select * from master_catalog.devicenotification_log where isopen = 1 and deviceid = '${device_id}';`;
    },
    getUnsetNotification: (device_id, peripheral) => {
        return `select * from master_catalog.devicenotification_log where isopen = 1 and deviceid = '${device_id}' and peripheral = '${peripheral}' order by created_timestamp limit 1;`;
    },
    resetUnsetNotification: (device_id, peripheral) => {
        return `UPDATE master_catalog.devicenotification_log
                SET isopen=0 WHERE isopen=1 AND deviceid='${device_id}' AND peripheral='${peripheral}'`
    },
    resolveNotification: (device_id, peripheral, created_timestamp) => {
        return `UPDATE master_catalog.devicenotification_log
                SET isopen=0 WHERE deviceid='${device_id}' AND peripheral='${peripheral}' AND created_timestamp='${created_timestamp}' `
    }
}