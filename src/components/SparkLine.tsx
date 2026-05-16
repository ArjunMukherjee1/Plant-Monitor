import React from 'react';
import { View } from 'react-native';
import Svg, { Polygon, Polyline } from 'react-native-svg';
import { HistoryPoint } from '../api/types';

interface Props {
  data: HistoryPoint[];
  color: string;
  height?: number;
}

const W = 300;

export function SparkLine({ data, color, height = 44 }: Props) {
  if (data.length < 2) return <View style={{ height }} />;

  const values = data.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const pts = data.map((p, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = height - ((p.value - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const fillPts = [...pts, `${W},${height}`, `0,${height}`].join(' ');

  return (
    <View style={{ height }}>
      <Svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none">
        <Polygon points={fillPts} fill={color + '33'} />
        <Polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" />
      </Svg>
    </View>
  );
}
