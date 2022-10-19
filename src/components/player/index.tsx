import { EventEmitter } from "events";
import { FC, useCallback, useMemo } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WaveformPlaylist from "waveform-playlist";

import "waveform-playlist/styles/playlist.css";
import { Button, Group } from "@mantine/core";
import { IconPlayerPause, IconPlayerPlay, IconPlayerStop } from "@tabler/icons";

interface Track {
  url: string;
  name: string;
}

interface PlayerProps {
  tracks: Track[];
}

const normalizeTrackMetadata = (tracks: Track[]) =>
  tracks.map((track) => ({
    src: track.url,
    name: track.name,
  }));

const Player: FC<PlayerProps> = ({ tracks }) => {
  const ee = useMemo(() => new EventEmitter(), []);

  const trackObject = useMemo(() => normalizeTrackMetadata(tracks), [tracks]);

  const container = useCallback(
    (node: any) => {
      if (node !== null) {
        const playlist = WaveformPlaylist(
          {
            timescale: true,
            samplesPerPixel: 2000,
            waveHeight: 100,
            container: node,
            state: "cursor",
            colors: {
              waveOutlineColor: "#E0EFF1",
              timeColor: "grey",
              fadeColor: "black",
            },
            controls: {
              show: true,
              width: 150,
            },
            zoomLevels: [500, 1000, 2000],
          },
          ee
        );

        playlist.load(trackObject);
      }
    },
    [ee, trackObject]
  );

  return (
    <>
      <main>
        <Group position="apart">
          <Button
            color="green"
            leftIcon={<IconPlayerPlay />}
            onClick={() => {
              ee.emit("play");
            }}
          >
            Play
          </Button>
          <Button
            color="orange"
            leftIcon={<IconPlayerPause />}
            onClick={() => {
              ee.emit("pause");
            }}
          >
            Pause
          </Button>

          <Button
            color="red"
            leftIcon={<IconPlayerStop />}
            onClick={() => {
              ee.emit("stop");
            }}
          >
            Stop
          </Button>
        </Group>
        <div ref={container}></div>
      </main>
    </>
  );
};

export default Player;
