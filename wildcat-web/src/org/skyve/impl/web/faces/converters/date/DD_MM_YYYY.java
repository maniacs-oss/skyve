package org.skyve.impl.web.faces.converters.date;

import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.Converter;

import org.skyve.domain.types.DateOnly;
import org.skyve.impl.util.UtilImpl;

public class DD_MM_YYYY extends org.skyve.domain.types.converters.date.DD_MM_YYYY implements Converter {
	@Override
	public Object getAsObject(FacesContext fc, UIComponent component, String value) {
    	java.lang.String processedValue = UtilImpl.processStringValue(value);
    	if (processedValue != null) {
			try {
				return fromDisplayValue(processedValue);
			}
			catch (Exception e) {
				return null;
			}
		}
		return null;
	}

	@Override
	public String getAsString(FacesContext fc, UIComponent component, Object value) {
		try {
			return toDisplayValue((DateOnly) value);
		}
		catch (Exception e) {
			return null;
		}
	}
}