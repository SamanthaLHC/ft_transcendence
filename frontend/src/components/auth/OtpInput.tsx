export type Props = {
	value: string;
	valueLength: number;
	onChange: (value: string) => void;
};

export default function OtpInput({ value, valueLength, onChange }: Props) {
	return (
		<div className="otp-group">
			{[1, 2, 3, 4, 5, 6].map((digit, idx) => (
				<input
					key={idx}
					type="text"
					inputMode="numeric"
					autoComplete="one-time-code"
					pattern="\d{1}"
					maxLength={valueLength}
					className="otp-input"
					value={digit}
				/>
			))}
		</div>
	);
}