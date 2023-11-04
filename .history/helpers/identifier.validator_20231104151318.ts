export function identifierValidator(identifier: string) {
  const  reservedWords: string[] = ["abstract",	"arguments",	"await",	"boolean", "break",	"byte", "case",	"catch","char",	"class", "const",	"continue","debugger","default","delete","do"double	else	enum*	eval export*	extends*	false	final finally	float	for	function goto	if	implements	import* in	instanceof	int	interface let*	long	native	new null	package	private	protected public	return	short	static super*	switch	synchronized	this throw	throws	transient	true try	typeof	var	void volatile	while	with	yieldabstract	boolean	byte	char double	final	float	goto int	long	native	short synchronized	throws	transient	volatile
]
  const regex =
    /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$^[a-zA-Z0-9]+$/;
  return regex.test(identifier);
}
