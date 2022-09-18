import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, Token } from "cdktf";
import { SpotifyProvider, Playlist, DataSpotifySearchTrack } from "./.gen/providers/spotify";
import * as dotenv from 'dotenv'

dotenv.config()
class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // アーティスト名
    const artists = [
      "Awich",
      "柊人",
      "BASI",
      "SALU",
      "BAD HOP",
      "PUNPEE",
      "VaVa",
      "BIM",
      "imase",
      "KEIJU",
      "舐達麻",
      "SPARTA",
      "604",
      "Daichi Yamamoto",
      "KID FRESINO",
      "OMSB",
      "kZm"
    ]

    // データソース
    // https://www.terraform.io/cdktf/concepts/data-sources#define-data-sources
    const tracks = artists.map((artist, index) => {
      const dataSpotifySearchTrack = new DataSpotifySearchTrack(this, `searchTrack_${index}`, {
        artist: artist,
      })
      return [...Array(4).keys()].map(n => dataSpotifySearchTrack.tracks.get(n).id)
    }).flat()

    // プロバイダー
    // https://www.terraform.io/cdktf/concepts/providers
    new SpotifyProvider(this, "spotify", {
      apiKey: Token.asString(process.env.SPOTIFY_API_KEY),
    });

    // リソース作成（プレイリスト）
    const spotify_playlist = new Playlist(this, "playlist", {
      name: "My Playlist CDKTF",
      description: "This playlist was created by CDKTF",
      public: true,
      tracks,
    });

    // 出力
    // https://www.terraform.io/cdktf/concepts/variables-and-outputs
    new TerraformOutput(this, "playlist url", {
      value: `https://open.spotify.com/playlist/${spotify_playlist.id}`,
    });
  }
}

const app = new App();
new MyStack(app, "learn-cdktf-spotify");
app.synth();
