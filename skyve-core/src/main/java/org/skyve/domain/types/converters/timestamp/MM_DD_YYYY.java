package org.skyve.domain.types.converters.timestamp;

import org.skyve.CORE;
import org.skyve.domain.types.Timestamp;
import org.skyve.domain.types.converters.Converter;
import org.skyve.domain.types.converters.Format;
import org.skyve.domain.types.converters.Validator;
import org.skyve.metadata.model.Attribute.AttributeType;

public class MM_DD_YYYY implements Converter<Timestamp> {

	public static final String PATTERN = "MM/dd/yyyy";

	@Override
	public Timestamp fromDisplayValue(String displayValue) throws Exception {
		return new Timestamp(CORE.getDateFormat(PATTERN).parse(displayValue).getTime());
	}

	@Override
	public String toDisplayValue(Timestamp value) throws Exception {
		return CORE.getDateFormat(PATTERN).format(value);
	}

	@Override
	public AttributeType getAttributeType() {
		return AttributeType.timestamp;
	}

	@Override
	public Format<Timestamp> getFormat() {
		return null;
	}

	@Override
	public Validator<Timestamp> getValidator() {
		return null;
	}
}
