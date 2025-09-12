import React, { useState, useRef, useEffect } from "react";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import GaugePowerFactor from "components/GaugePowerFactor/GaugePowerFactor";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import axios from "axios";
import { api } from "../../services/api";
import { io } from "socket.io-client";

const useStyles = makeStyles(styles);

export default function Compteur4() {
  const classes = useStyles();

  const [dataEne, setDataEne] = useState([]);
  const [dataFre, setDataFre] = useState([]);
  const [dataPui, setDataPui] = useState([]);
  const [dataTens, setDataTens] = useState([]);
  const [dataCou, setDataCou] = useState([]);
  const [last, setLast] = useState(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    axios
      .get(api() + "/Compteur4/allCompteur4")
      .then((res) => {
        const dataTrEne = res.data.compteur4.map(item => ({
          time: item.TimeStamp,
          active: item.Pw,
          reactive: item.Qvar
        }));
        const dataTrFre = res.data.compteur4.map(item => ({
          minute: item.TimeStamp,
          frequency: item.Freq
        }));
        const dataTrPui = res.data.compteur4.map(item => ({
          minute: item.TimeStamp,
          active: item.Pw,
          reactive: item.Qvar,
          apparent: item.Sva
        }));
        const dataTrTens = res.data.compteur4.map(item => ({
          minute: item.TimeStamp,
          VoltageU12: item.U12,
          VoltageU23: item.U23,
          VoltageU31: item.U31
        }));
        const dataTrCou = res.data.compteur4.map(item => ({
          minute: item.TimeStamp,
          PhaseCurrent1: item.L1,
          PhaseCurrent2: item.L2,
          PhaseCurrent3: item.L3
        }));

        setDataEne(dataTrEne)
        setDataFre(dataTrFre)
        setDataPui(dataTrPui)
        setDataTens(dataTrTens)
        setDataCou(dataTrCou)

      })
      .catch((error) => {
        console.log(error);
      });

    const socket = io(api() + "/compteurs", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
    });
    socketRef.current = socket;

    socket.on("connect", () => { setConnected(true); setError(null); });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => setError(err?.message || "Socket connect error"));

    socket.on("compteur4:last", (payload) => {
      if (payload?.lastRecord) {
        setLast(payload.lastRecord)
        setDataEne(prevData => [...prevData, { 
          time: payload.lastRecord.TimeStamp, 
          active: payload.lastRecord.Pw, 
          reactive: payload.lastRecord.Qvar }])
        setDataFre(prevData => [...prevData, {
          minute: payload.lastRecord.TimeStamp,
          frequency: payload.lastRecord.Freq
        }])
        setDataPui(prevData => [...prevData, {
          minute: payload.lastRecord.TimeStamp,
          active: payload.lastRecord.Pw,
          reactive: payload.lastRecord.Qvar,
          apparent: payload.lastRecord.Sva
        }])
        setDataTens(prevData => [...prevData, {
          minute: payload.lastRecord.TimeStamp,
          VoltageU12: payload.lastRecord.U12,
          VoltageU23: payload.lastRecord.U23,
          VoltageU31: payload.lastRecord.U31
        }])
        setDataCou(prevData => [...prevData, {
          minute: payload.lastRecord.TimeStamp,
          PhaseCurrent1: payload.lastRecord.L1,
          PhaseCurrent2: payload.lastRecord.L2,
          PhaseCurrent3: payload.lastRecord.L3
        }])
      };
    });

    // 3) initial fetch so UI shows something before first socket emit
    fetch(api() + "/Compteur4/getLastRecord")
      .then((r) => r.json())
      .then((d) => setLast(d?.lastRecord ?? null))
      .catch((e) => setError(e?.message || "Failed to load last record"));

    return () => {
      socket.off("compteur4:last");
      socket.close();
    };
  }, []);


  // const data0 = [
  //   { time: "2025-09-04T13:58:34.511Z", active: 40, reactive: 20 },
  //   { time: "2025-09-04T14:58:34.511Z", active: 65, reactive: 35 },
  //   { time: "2025-09-04T15:58:34.511Z", active: 50, reactive: 28 },
  //   { time: "2025-09-04T16:58:34.511Z", active: 90, reactive: 60 },
  //   { time: "2025-09-04T17:58:34.511Z", active: 70, reactive: 45 },
  //   { time: "2025-09-04T18:58:34.511Z", active: 100, reactive: 80 },
  //   { time: "2025-09-04T18:58:40.511Z", active: 20, reactive: 10 },
  // ];

  // const data1 = [
  //   { minute: 0, frequency: 50 },
  //   { minute: 200, frequency: 49.98 },
  //   { minute: 400, frequency: 50.01 },
  //   { minute: 600, frequency: 49.99 },
  //   { minute: 1000, frequency: 50.03 },
  //   { minute: 1500, frequency: 49.97 },
  //   { minute: 1600, frequency: 50.00 },
  //   { minute: 2000, frequency: 50.01 },
  //   // ... more samples up to 2000
  // ];

  // const data2 = [
  //   { minute: 0, active: 0, reactive: 0, apparent: 0 },
  //   { minute: 100, active: 400, reactive: 200, apparent: 500 },
  //   { minute: 200, active: 600, reactive: 300, apparent: 800 },
  //   { minute: 300, active: 200, reactive: 150, apparent: 300 },
  //   { minute: 400, active: 800, reactive: 400, apparent: 1000 },
  //   { minute: 500, active: 0, reactive: 0, apparent: 0 },
  //   { minute: 600, active: 300, reactive: 200, apparent: 400 },
  //   // ... extend as needed
  // ];

  // const data3 = [
  //   { minute: 0, VoltageU21: 0, VoltageU32: 0, VoltageU13: 0 },
  //   { minute: 100, VoltageU21: 500, VoltageU32: 280, VoltageU13: 640 },
  //   { minute: 200, VoltageU21: 300, VoltageU32: 450, VoltageU13: 930 },
  //   { minute: 300, VoltageU21: 100, VoltageU32: 150, VoltageU13: 300 },
  //   { minute: 400, VoltageU21: 780, VoltageU32: 350, VoltageU13: 900 },
  //   { minute: 500, VoltageU21: 0, VoltageU32: 0, VoltageU13: 0 },
  //   { minute: 600, VoltageU21: 100, VoltageU32: 350, VoltageU13: 1000 },
  //   // ... extend as needed
  // ];

  // const data4 = [
  //   { minute: 0, PhaseCurrent11: 0, PhaseCurrent12: 0, PhaseCurrent13: 0 },
  //   { minute: 100, PhaseCurrent11: 500, PhaseCurrent12: 400, PhaseCurrent13: 800 },
  //   { minute: 200, PhaseCurrent11: 700, PhaseCurrent12: 450, PhaseCurrent13: 1000 },
  //   { minute: 300, PhaseCurrent11: 300, PhaseCurrent12: 250, PhaseCurrent13: 450 },
  //   { minute: 400, PhaseCurrent11: 900, PhaseCurrent12: 500, PhaseCurrent13: 1000 },
  //   { minute: 500, PhaseCurrent11: 0, PhaseCurrent12: 0, PhaseCurrent13: 0 },
  //   { minute: 600, PhaseCurrent11: 250, PhaseCurrent12: 360, PhaseCurrent13: 600 },
  //   // ... extend as needed
  // ];

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody style={{ textAlign: "right" }}>
              <p className={classes.cardCategory}>
                Energie Consommée
              </p>
              <h2 style={{ marginBottom: '21%', marginTop: '6%', color: 'hsl(142 76% 36%)', fontWeight: "700" }} className={classes.cardTitle}>
                {last ? last.Enr.toString() : 0} <small>KWh</small>
              </h2>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody style={{ textAlign: "right" }}>
              <p className={classes.cardCategory}>
                Puissance Active
              </p>
              <h2 style={{ marginBottom: '21%', marginTop: '6%', color: 'hsl(142 76% 36%)', fontWeight: "700" }} className={classes.cardTitle}>
                {last ? last.Pw.toString() : 0} <small>KW</small>
              </h2>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody style={{ textAlign: "right" }}>
              <p className={classes.cardCategory}>
                Puissance Réactive
              </p>
              <h2 style={{ marginBottom: '21%', marginTop: '6%', color: 'hsl(142 76% 36%)', fontWeight: "700" }} className={classes.cardTitle}>
                {last ? last.Qvar.toString() : 0} <small>Kvar</small>
              </h2>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody style={{ textAlign: "right" }}>
              <p className={classes.cardCategory}>
                Puissance Apparente
              </p>
              <h2 style={{ marginBottom: '21%', marginTop: '6%', color: 'hsl(142 76% 36%)', fontWeight: "700" }} className={classes.cardTitle}>
                {last ? last.Sva.toString() : 0} <small>kVA</small>
              </h2>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody>
              <p style={{ textAlign: "center" }} className={classes.cardCategory}>Facteur de puissance Global cos(φ)</p>
              <GaugePowerFactor value={last ? last.Fp : 0} />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={2}>
          <Card>
            <CardBody style={{ textAlign: "right" }}>
              <p className={classes.cardCategory}>
                Fréquence
              </p>
              <h2 style={{ marginBottom: '21%', marginTop: '6%', color: 'hsl(142 76% 36%)', fontWeight: "700" }} className={classes.cardTitle}>
                {last ? last.Freq.toString() : 0} <small>Hz</small>
              </h2>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <GridContainer>

            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Tension U12
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.U12.toString() : 0} <small style={{ color: '#000000ff' }}>V</small>
                      </h2>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Tension U23
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.U23.toString() : 0} <small style={{ color: '#000000ff' }}>V</small>
                      </h2>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Tension U31
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.U31.toString() : 0} <small style={{ color: '#000000ff' }}>V</small>
                      </h2>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
          <GridContainer>

            <GridItem xs={12} sm={12} md={12}>
              <GridContainer>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Courant L1
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.L1.toString() : 0} <small style={{ color: '#000000ff' }}>A</small>
                      </h2>
                    </CardBody>
                  </Card>

                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Courant L2
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.L2.toString() : 0} <small style={{ color: '#000000ff' }}>A</small>
                      </h2>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={6} md={4}>
                  <Card style={{ backgroundColor: '#cad8e8' }}>
                    <CardBody style={{ textAlign: "right" }}>
                      <p style={{ color: '#000000ff' }} className={classes.cardCategory}>
                        Courant L3
                      </p>
                      <h2 style={{ marginBottom: '15%', color: '#000000ff', fontWeight: "700" }} className={classes.cardTitle}>
                        {last ? last.L3.toString() : 0} <small style={{ color: '#000000ff' }}>A</small>
                      </h2>
                    </CardBody>
                  </Card>
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardBody>
              <div style={{ width: "100%", height: 300 }}>
                <h4 style={{ textAlign: "center" }}>Energie Consommée</h4>
                <ResponsiveContainer>
                  <AreaChart data={dataEne} margin={{ top: 0, right: 20, left: 0, bottom: 50 }}>
                    <defs>
                      <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f44336" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f44336" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="colorReactive" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#ff9800" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stroke="#f44336"
                      fillOpacity={1}
                      fill="url(#colorActive)"
                    />
                    <Area
                      type="monotone"
                      dataKey="reactive"
                      stroke="#ff9800"
                      fillOpacity={1}
                      fill="url(#colorReactive)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardBody>
              <div style={{ width: "100%", height: 300 }}>
                <h4 style={{ textAlign: "center" }}>Fréquence</h4>
                <ResponsiveContainer>
                  <LineChart data={dataFre} margin={{ top: 0, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="minute" label={{ value: "Minutes", position: "insideBottom", offset: -5 }} />
                    <YAxis
                      // domain={[49.95, 50.05]}
                      // label={{ value: "Frequency (Hz)", angle: -90, position: "insideCenter" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="frequency"
                      stroke="#c2185b"
                      dot={false}
                      name="Frequency (F)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>


      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardBody>
              <div style={{ width: "100%", height: 300 }}>
                <h4 style={{ textAlign: "center" }}>Puissances</h4>
                <ResponsiveContainer>
                  <LineChart data={dataPui} margin={{ top: 0, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="minute"
                      // label={{ value: "Minutes", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      // label={{ value: "Power (kW/kVar/kVA)", angle: -90, position: "insideCenter" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="active"
                      stroke="#ff9800"
                      dot={false}
                      name="Active Power (P)"
                    />
                    <Line
                      type="monotone"
                      dataKey="reactive"
                      stroke="#3f51b5"
                      dot={false}
                      name="Reactive Power (Q)"
                    />
                    <Line
                      type="monotone"
                      dataKey="apparent"
                      stroke="#4caf50"
                      dot={false}
                      name="Apparent Power (S)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardBody>
              <div style={{ width: "100%", height: 300 }}>
                <h4 style={{ textAlign: "center" }}>Tensions Lignes RMS</h4>
                <ResponsiveContainer>
                  <LineChart data={dataTens} margin={{ top: 0, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="minute"
                      // label={{ value: "Minutes", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      // label={{ value: "Voltage (V)", angle: -90, position: "insideCenter" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="VoltageU12"
                      stroke="#3f51b5"
                      dot={false}
                      name="Voltage U12"
                    />
                    <Line
                      type="monotone"
                      dataKey="VoltageU23"
                      stroke="#ec5f5fff"
                      dot={false}
                      name="Voltage U23"
                    />
                    <Line
                      type="monotone"
                      dataKey="VoltageU31"
                      stroke="#4caf50"
                      dot={false}
                      name="Voltage U31"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardBody>
              <div style={{ width: "100%", height: 300 }}>
                <h4 style={{ textAlign: "center" }}>Courant Ligne RMS</h4>
                <ResponsiveContainer>
                  <LineChart data={dataCou} margin={{ top: 0, right: 30, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="minute"
                      // label={{ value: "Minutes", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      // label={{ value: "Power (kW/kVar/kVA)", angle: -90, position: "insideCenter" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="PhaseCurrent1"
                      stroke="#3f51b5"
                      dot={false}
                      name="Phase Current 1"
                    />
                    <Line
                      type="monotone"
                      dataKey="PhaseCurrent2"
                      stroke="#ec5f5fff"
                      dot={false}
                      name="Phase Current 2"
                    />
                    <Line
                      type="monotone"
                      dataKey="PhaseCurrent3"
                      stroke="#4caf50"
                      dot={false}
                      name="Phase Current 3"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>
        </GridItem>

      </GridContainer>
    </div>
  );
}
