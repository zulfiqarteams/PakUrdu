import { Keyboard, Rabbit, Target, Timer, Zap } from "lucide-react";
import { gameDefinitions } from "../data/gameDefinitions";
import { GameCard } from "./GameCard";
const icons = { "letter-hunter": Target, "word-rush": Zap, "combo-master": Keyboard, "typing-sprint": Timer, "urdu-survival": Rabbit };
export function GameGrid() { return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{gameDefinitions.map((game) => <GameCard key={game.id} game={game} icon={icons[game.id]}/>)}</div>; }
