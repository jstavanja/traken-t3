import { Track, Composition } from "@prisma/client";

export interface TrackWithURL extends Track {
  url: string;
}

export interface CompositionWithTracksThatHaveURLs
  extends Omit<Composition, "tracks"> {
  tracks: TrackWithURL[];
}
