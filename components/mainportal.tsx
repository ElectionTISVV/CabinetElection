"use client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function VoteForm({ house }: { house: string }) {
	const [id, setId] = useState("");
	const [vote1, setVote1] = useState("");
	const [vote2, setVote2] = useState("");
	const [vote3, setVote3] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setMessage("");
		if (vote1 == "" || vote2 == "" || vote3 == "") {
			setMessage("Please select all 3 candidates");
		} else {
			try {
				const response = await axios.post("/api/submit-vote", {
					id,
					vote1,
					vote2,
					vote3,
					house: house,
				});
				setMessage(response.data.message);
				setVote1("");
				setVote2("");
				setVote3("");
				setId("");
			} catch (error) {
				setMessage("An error occurred while submitting the vote." + error);
			}
		}
	};
	const houses = ["ekta", "pragati", "shakti", "shanti"];
	const listOfCandidates = [
		[
			"Angad Harmohan Singh",
			"Anaya Kanodia",
			"Tanvi Arora",
			"Dhrishti Verma",
			"Samyata Kain",
			"Adivye Guha",
		],
		[
			"Arnav Kashyap",
			"Amayra Channa",
			"Rashil Miglani",
			"Agrima Bali",
			"Manssha Taneja",
			"Akyam Kaur",
		],
		[
			"Kavya Anand",
			"Kiratjot Singh",
			"Aarohan Tyagi",
			"Pavneet Kaur",
			"Prathna Bagga",
			"Mehak Karnani",
		],
		[
			"Ishit Adhikari",
			"Sharon Malsawmkimi",
			"Akshit Wadhwa",
			"Sarthak Tyagi",
			"Mehr Chaddha",
			"Niyamat Kochhar",
		],
	][houses.indexOf(house)];

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-5">
			<div>
				<Input
					placeholder="Unique ID"
					type="text"
					value={id}
					onChange={(e) => setId(e.target.value)}
					required
				/>
			</div>
			<div className="flex gap-10">
				<div>
					Vote 1
					<RadioGroup
						value={vote1}
						onValueChange={(e) => {
							setVote1(e);
						}}
						required
					>
						{listOfCandidates.map((e, index) => {
							return (
								<div className="flex items-center space-x-2" key={index}>
									<RadioGroupItem
										value={e}
										id={"1" + e.split(" ")[0]}
										checked={vote1 === e}
									/>
									<Label htmlFor={"1" + e.split(" ")[0]}>{e}</Label>
								</div>
							);
						})}
					</RadioGroup>
				</div>
				<div>
					Vote 2
					<RadioGroup
						value={vote2}
						onValueChange={(e) => {
							setVote2(e);
							console.log(e);
						}}
						required
					>
						{listOfCandidates.map((e, index) => {
							return (
								<div className="flex items-center space-x-2" key={index}>
									<RadioGroupItem
										value={e}
										id={"2" + e.split(" ")[0]}
										checked={vote2 === e}
									/>
									<Label htmlFor={"2" + e.split(" ")[0]}>{e}</Label>
								</div>
							);
						})}
					</RadioGroup>
				</div>
				<div>
					Vote 3
					<RadioGroup
						value={vote3}
						onValueChange={(e) => {
							setVote3(e);
							console.log(e);
						}}
						required
					>
						{listOfCandidates.map((e, index) => {
							return (
								<div className="flex items-center space-x-2" key={index}>
									<RadioGroupItem
										value={e}
										id={"3" + e.split(" ")[0]}
										checked={vote3 === e}
									/>
									<Label htmlFor={"3" + e.split(" ")[0]}>{e}</Label>
								</div>
							);
						})}
					</RadioGroup>
				</div>
			</div>
			<Button type="submit">Submit</Button>
			<p className="h-10">{message}</p>
		</form>
	);
}
